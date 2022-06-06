# lib-managed-storage

A storage engine for managed objects. Tracks object identity, ownership, and permissions.

```
                                                                                    +--------------------------+
                                                                                    |      MongoProvider       |
                                                                                /== +--------------------------+
                                                                               /    | Reads and writes objects |
  +-----------------+    +------------------------+    +-----------------+    /     | to a MongoDB instance.   |
  |   Application   |    |     ManagedObject      |    | ManagedStorage  |   /      +--------------------------+
  +-----------------+ == +------------------------+ == +-----------------+ ==      
  | Works with user |    | Combines user identity |    | Controls access |   \     
  | owned objects.  |    | with object identity.  |    | user identity.  |    \     +--------------------------+
  +-----------------+    +------------------------+    +-----------------+     \    |      JsonProvider        |
								                                                \== +--------------------------+
									                              		            | Reads and writes objects |
															                        | to an in-memory array.   |
															                        +--------------------------+
```

Object Lifecycle Management
---------------------------------------------------------------------
This library models an object and manages the following aspects of its lifecycle:
- Object Creation: Creation and modification timestamps are maintained for each object.
- Object Identity: Each object has a unique id.
- Object Ownership: Every object has a user as an owner. There exists a built-in [System Administrator] user account.
- Object Serialization: Objects are saved to a structured storage using a MongoDB-like interface.
- Object Manipulation: Objects can be created, listed, searched, updated, and removed.


User Objects
---------------------------------------------------------------------
A `User` object must have the `user_id` and `user_role` fields and is used by all of the storage interface functions.

The `User.user_id` field is a string identifier which uniquely identifies a user (e.g. an email address).

The `User.user_role` field can be one of:
- `'admin'`: A role that permits system-wide access to objects, regardless of ownership.
- `'super'`: A role that permits system-wide access to objects, regardless of ownership.
- `'user'`: A role that allows a user access to objects that they create, or are shared to by another user.
- `''` (empty): A role that allows a user access to only objects marked as public.


Object Access and Permissions
---------------------------------------------------------------------
Managed storage supports three type of user access to objects:
- System: Users having the role of `'admin'` or `'super'` can access the objects of any user.
- Object: Users having the role of `'user'` can access only those which they create or objects shared to them by other users.
- Public: Users having no role or only able to access objects marked as public.


Storage Interface Functions
---------------------------------------------------------------------
All storage operations are constrained to the following functions:
- Discovery Functions
	- Count
	- FindOne
	- FindMany
- Manipulation Functions
	- CreateOne
	- WriteOne
	- DeleteOne
	- DeleteMany

This interface of functions is used by `ManagedStorage` as well as by the `StorageProvider` implementations.
The functionality and purpose of each function is the same throughout the library.


ManagedStorage
---------------------------------------------------------------------
This library exposes functions for object creation, querying, and manipulation.
Each function, in turn, calls corresponding functions within the configured storage provider to complete its task.
What `ManagedStorage` does is the following:
- Provides an abstraction away from the ultimate details of object storage.
	These details are implemented in the configured `StorageProvider`.
- Provides user based access control to objects.
	Each function within `ManagedStorage` takes a user object as its first parameter
	which is used to add a layer of user identity to each query and operation.
	This means that each function runs in the context of the supplied user and is constrained
	to working with only those objects which they own or are shared to them.
- Provides a uniform object identity scheme.
	Each `StorageProvider` has its own identity mechanism (e.g. `{ _id: '8fbd40...' }`).
	`ManagedStorage` does not rely upon the `StorageProvider` defined identity, but instead,
	introduces its own identity mechanism which it (and the application) rely upon.

### ManagedStorage Functions
- Discovery Functions
	- Count			( User, Criteria )
	- FindOne		( User, Criteria )
	- FindMany		( User, Criteria )

- Manipulation Functions
	- CreateOne		( User, Prototype )
	- WriteOne		( User, ManagedObject )
	- DeleteOne		( User, Criteria )
	- DeleteMany	( User, Criteria )

- Sharing Functions
	- Share			( User, Reader, Writer, Criteria )
	- Unshare		( User, Reader, Writer, Criteria )

- These functions return a single object: `CreateOne`, `ReadOne`, and `FindOne`.
- These functions return an array of objects: `ListAll`, `ListMine`, and `FindMany`.
- These functions return an integer value, indicating the number of objects that were found or affected:
	`CountAll`, `CountMine`,`WriteOne`, `DeleteOne`, `DeleteMine`, and `DeleteAll`.
- The storage provider implements the inner details of these functions.
- The `Criteria` parameter can be omitted, be `null`, or be an empty object `{}`.
	In such cases, these functions will exhibit special behavior:
	- `CountAll` will count all objects.
	- `CountMine` will count all objects belonging to the user.
	- `FindOne` will find the first (random) object belonging to the user.
	- `FindMany` will find all objects belonging to the user.


Storage Providers
---------------------------------------------------------------------
A storage provider connects an application to a single collection of objects.

- `MongoProvider`
	- Stores objects in a MongoDB database.

- `JsonProvider`
	- Stores objects locally in memory.
	- Configuration options exist to read the contents of the collection from a disk file.
	- Configuration options exist to flush the contents of the collection back to the same disk file.
	- When using `flush_every_ms`  configuration option,
		take care to explicitly call the `Flush()` function as the application is shutting down.
		Failure to do so will likely result in the disk file being inaccurate.


### The Storage Provider Interface
Each storage provider (e.g. `MongoProvider` and `JsonProvider`) implement a common interface and,
through configuration, can be used interchangeably by the application.
An instance of a storage provider allows an application to work with a single collection of objects.

- `Flush		()`
	: Used to invoke any internal processes related to persisting in-memory objects.
	This function does nothing in the `MongoProvider` implementation.
	For `JsonProvider`, this function will write all in-memory objects to the configured disk file location.

- `Count		( Criteria )`
	: Returns the number of objects matched by `Criteria`.
	If `Criteria` is missing or empty, then the count all objects will be returned.

- `FindOne		( Criteria )`
	: Returns the first object matched by `Criteria`.
	If `Criteria` is missing or empty, then the first (random) object will be returned.

- `FindMany		( Criteria )`
	: Returns all objects matching `Criteria`.
	If `Criteria` is missing or empty, then all objects will be returned.

- `CreateOne	( DataObject )`
	: Adds a new object to the collection.
	The `DataObject` parameter will have an `_id` field added to it.
	If `DataObject._id` already exists, then it is overwritten.
	This function returns a copy of the modified `DataObject`.

- `WriteOne		( DataObject, Criteria )`
	: Replaces a single object within the collection.
	If `Criteria` is missing or empty, then `DataObject._id` must exist.
	If `Criteria` matches more than one object, then only the first one will be replaced.
	This function will return a `1` if the object was successfully found and replaced.
	Otherwise, it returns a `0` to indicate that no replacement was made.

- `DeleteOne	( Criteria )`
	: Removes a single object from the collection.
	If `Criteria` is missing or empty, then the first (random) object will be removed.
	This function will return a `1` if the object was successfully found and removed.
	Otherwise, it returns a `0` to indicate that no removal was performed.

- `DeleteMany	( Criteria )`
	: Removes all objects matching `Criteria`.
	If `Criteria` is missing or empty, then the all objects will be removed.
	This function returns the number of objects that were matched and removed.


ManagedObject
---------------------------------------------------------------------
Applications can call the `NewManagedObject( owner, object )` function to create a new managed object.

- A managed object will have two root members:
	- `_m` to store internal object metadata. This structure is static and maintained by this code.
		- `_m.id`: The object's unique id, required by the interface functions.
		- `_m.created_at`: The creation timestamp (zulu).
		- `_m.updated_at`: The modification timestamp (zulu).
		- `_m.owner_id`: The `User.user_id` of the object's owner.
		- `_m.partners`: Array of `User.user_id`s that have access to this object.
		- `_m.public`: Boolean flag marking this object as public.
		<!--
		- `_m.name`: An application maintained field used when calling the `FindName` function. *(TBD: implement in ManagedHierarchy.js)*
		- `_m.path`: An application maintained field used when calling the `FindChildren` function. *(TBD: implement in ManagedHierarchy.js)*
		-->
	- `_o` to store application object data. This structure is application defined via the `ObjectDefinition` structure.


Application Customization
---------------------------------------------------------------------
Exposes three key data structures to other areas of the server:
- `Configuration`: The configuration block used for database or service connections.
	- Used by application during initialization.
- `ObjectDefinition`: The definition of the managed object including UI hints and field definitions.
	- This is intended to be set by the implemented service.
- `Authorization`: Role based access controls for managed functions.
	- This is intended to be set by the implementing service.


Object Manipulation via Web Service
---------------------------------------------------------------------
Exposes managed functions via web services with the `StorageService` function.


Miscellaneous Notices
---------------------------------------------------------------------
- Source code ASCII art banners generated using [https://patorjk.com/software/taag](https://patorjk.com/software/taag/#p=display&f=Univers) with the "Univers" font.
- The `JsonProvider` implementation was partly inspired by the project [jsondbfs](https://github.com/mcmartins/jsondbfs).

