# lib-managed-storage
A storage engine for managed objects. Tracks object identity, ownership, and permissions.


Managed Storage
==========================================

Object Lifecycle Management
---------------------------------------------------------------------
Models an object and manages the following aspects of its lifecycle:
- Object Creation: Creation and modification timestamps are maintained for each object.
- Object Identity: Each object has a unique id.
- Object Ownership: Every object has a user as an owner. There exists a built-in [System Administrator] user account.
- Object Serialization: Objects are saved to a structured storage with a MongoDB-like interface.
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


Storage Interface
---------------------------------------------------------------------
Supports core (managed) functions for serialization and manipulation:

- Discovery Functions
	- ListAll		( User )
	- ListMine		( User )
	- FindOne		( User, Criteria )
	- FindMany		( User, Criteria )
	<!--
	- FindName		( User, Name ) *(TBD: implement in ManagedHierarchy.js)*
	- FindChild		( User, Path ) *(TBD: implement in ManagedHierarchy.js)*
	- FindChildren	( User, Path ) *(TBD: implement in ManagedHierarchy.js)*
	-->

- Manipulation Functions
	- CreateOne		( User, Prototype )
	- ReadOne		( User, ObjectID )
	- WriteOne		( User, Object )
	- DeleteOne		( User, ObjectID )
	- DeleteMine	( User )
	- DeleteAll		( User )
	<!--
	- SetPath		( User, ObjectID, Path ) *(TBD: implement in ManagedHierarchy.js)*
	-->

- These functions return a single object: CreateOne, ReadOne, and FindOne.
- These functions return an array of objects: ListAll, ListMine, and FindMany.
- These functions return a true/false status: WriteOne, DeleteOne, DeleteMine, and DeleteAll.
- The storage provider implements the inner details of these functions.


Object Creation and Design
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
	- Used by `App` during initialization.
- `ObjectDefinition`: The definition of the managed object including UI hints and field definitions.
	- This is intended to be set by the implemented service.
- `Authorization`: Role based access controls for managed functions.
	- This is intended to be set by the implemented service.


Object Manipulation via Web Service
---------------------------------------------------------------------
Exposes managed functions via web services with the `StorageService` function.


Miscellaneous Notices
---------------------------------------------------------------------
- Source code ASCII art banners generated using [https://patorjk.com/software/taag](https://patorjk.com/software/taag/#p=display&f=Univers) with the "Univers" font.
