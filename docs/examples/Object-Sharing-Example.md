


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

