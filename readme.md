# lib-managed-storage (v0.0.1)

A storage engine for managed objects. Tracks object identity, ownership, and permissions.

```
                                                                                       +--------------------------+
                                                                                       |      MongoProvider       |
                                                                                   /== +--------------------------+
                                                                                  /    | Reads and writes objects |
  +-----------------+    +------------------------+    +--------------------+    /     | to a MongoDB instance.   |
  |   Application   |    |     ManagedObject      |    |   ManagedStorage   |   /      +--------------------------+
  +-----------------+ == +------------------------+ == +--------------------+ ==      
  | Works with user |    | Combines user identity |    | Controls access    |   \     
  | owned objects.  |    | with object identity.  |    | by user identity.  |    \     +--------------------------+
  +-----------------+    +------------------------+    +--------------------+     \    |      JsonProvider        |
								                                                   \== +--------------------------+
    								                              		               | Reads and writes objects |
															                           | to an in-memory array.   |
															                           +--------------------------+
```


Getting Started
---------------------------------------------------------------------

Install via NPM:
```bash
npm install @liquicode/lib-managed-storage
```

Include the library in your source code:
```javascript
const Lib = require( '@liquicode/lib-managed-storage' );
```


Simple Usage
---------------------------------------------------------------------

```javascript
const LIB_MANAGED_STORAGE = require( '@liquicode/lib-managed-storage' );

// Make some fake users.
let Alice = { user_id: 'alice@fake.com', user_role: 'admin' };
let Bob = { user_id: 'bob@fake.com', user_role: 'user' };
let Eve = { user_id: 'eve@fake.com', user_role: 'user' };

// Get the managed storage.
let storage = LIB_MANAGED_STORAGE.NewManagedStorage(); // Defaults to an in-memory json array.
let doc = null;

// Create some documents for Alice.
doc = await storage.CreateOne( Alice, { name: 'Public Document', text: 'This is a public document.' } );
await storage.Share( Alice, doc, null, null, true ); // Share this doc with everyone.

doc = await storage.CreateOne( Alice, { name: 'Internal Document', text: 'This is an internal document.' } );
await storage.Share( Alice, doc, null, Bob.user_id ); // Give read and write access to Bob.
await storage.Share( Alice, doc, Eve.user_id ); // Give read-only access to Eve.

doc = await storage.CreateOne( Alice, { name: 'Secret Document', text: 'This is a secret document.' } );
await storage.Share( Alice, doc, Bob.user_id ); // Give read-only access to Bob.

// Create some documents for Bob.
doc = await storage.CreateOne( Bob, { name: 'My Document', text: 'This is my document.' } );
doc = await storage.CreateOne( Bob, { name: 'My Document 2', text: 'This is my other document.' } );

// Create a document for Eve.
doc = await storage.CreateOne( Eve, { name: 'Evil Plans', text: 'Step 1: Take over the world.' } );

```


Primary Interface
---------------------------------------------------------------------

- Discovery Functions
	- Count			( User, Criteria )
	- FindOne		( User, CriteriaOrID )
	- FindMany		( User, Criteria )

- Manipulation Functions
	- CreateOne		( User, Prototype )
	- WriteOne		( User, ManagedObject )
	- DeleteOne		( User, CriteriaOrID )
	- DeleteMany	( User, Criteria )

- Sharing Functions
	- Share			( User, ManagedObjectOrID, Readers, Writers, MakePublic )
	- Unshare		( User, ManagedObjectOrID, NotReaders, NotWriters, MakeUnpublic )


Dependencies
---------------------------------------------------------------------

- [uuid](https://www.npmjs.com/package/uuid)
	: Used by `ManagedStorage` and `JsonProvider` to generate unique identifiers.
- [mongodb](https://www.npmjs.com/package/mongodb)
	: Used in the `MongoProvider` implementation.
- [json-criteria](https://www.npmjs.com/package/json-criteria)
	: Used to provide MongoDB-like query functionality in `JsonProvider`.
- [babel-polyfill](https://www.npmjs.com/package/@babel/polyfill)
	: A dependency of the `jsoin-criteria` package.
- [lockfile](https://www.npmjs.com/package/lockfile)
	: Used in the `JsonProvider` implementation when flush in-memory objects to disk.


More Links
---------------------------------------------------------------------

- [Library Source Code](https://github.com/liquicode/lib-managed-storage)
- [Library Docs Site](http://lib-managed-storage.liquicode.com)
- [Library NPM Page](https://www.npmjs.com/package/@liquicode/lib-managed-storage)


Miscellaneous Notices
---------------------------------------------------------------------

- Source code ASCII art banners generated using [https://patorjk.com/software/taag](https://patorjk.com/software/taag/#p=display&f=Univers) with the "Univers" font.
- The `JsonProvider` implementation was partly inspired by the project [jsondbfs](https://github.com/mcmartins/jsondbfs).

