# Testing Output


```


  000) Base Tests
    Assert Tests
      ✓ LIB_ASSERT.ok( true )
      ✓ LIB_ASSERT.strictEqual( 1, 1 )
      ✓ LIB_ASSERT.notStrictEqual( 0, 1 )

  010) MongoProvider Tests
    Collection Tests; 10 objects
      ✓ Should create test objects (2103ms)
      ✓ Should read and write test objects (4255ms)
      ✓ Should find all test objects (110ms)
      ✓ Should delete all test objects (215ms)

  011.1) JsonProvider (no-flush) Tests
    Collection Tests; 0 objects, no flush
      ✓ Should create test objects (13ms)
      ✓ Should read and write test objects (1399ms)
      ✓ Should find all test objects (8ms)
      ✓ Should delete all test objects

  011.2) JsonProvider (flush on update) Tests
    Collection Tests; 1000 objects, flush_on_update: true
      ✓ Should create test objects (910ms)
      ✓ Should read and write test objects (3080ms)
      ✓ Should find all test objects
      ✓ Should have a disk file
      ✓ Should delete all test objects

  011.3) JsonProvider (flush on interval) Tests
    Collection Tests; 1000 objects, flush_every_ms: 1000
      ✓ Should create test objects (32ms)
      ✓ Should read and write test objects (1477ms)
      ✓ Should find all test objects
      ✓ Should have a disk file
      ✓ Should delete all test objects (8ms)

  020) ManagedStorage Tests
    Alice, Bob, and Eve scenario
      ✓ Should add documents and set permissions
      ✓ Alice should read all documents and write all documents
      ✓ Bob should read some documents and write some documents
      ✓ Eve should read some documents and write some documents
      ✓ Public objects should be readable by everyone
      ✓ Public objects should only be writable by the owner
      ✓ Should not allow readers to update documents


  28 passing (14s)


```


