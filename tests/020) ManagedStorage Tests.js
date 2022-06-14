'use strict';


const LIB_MANAGED_STORAGE = require( '../src/lib-managed-storage.js' );
const LIB_MANAGED_STORAGE_TESTS = require( './_ManagedStorageTests.js' );

const LIB_FS = require( 'fs' );
const LIB_PATH = require( 'path' );
const LIB_UUID = require( 'uuid' );

const LIB_ASSERT = require( 'assert' );


//---------------------------------------------------------------------
describe( `020) ManagedStorage Tests`,
	function ()
	{


		//---------------------------------------------------------------------
		// Make some fake users.
		let Alice = { user_id: 'alice@fake.com', user_role: 'admin' };
		let Bob = { user_id: 'bob@fake.com', user_role: 'user' };
		let Eve = { user_id: 'eve@fake.com', user_role: 'user' };


		//---------------------------------------------------------------------
		let session_id = LIB_UUID.v4();
		let test_object_count = 1000;
		let managed_config = {
			throws_permission_errors: false, // Disable permission errors for testing.
			json_provider: {
				enabled: true,
				collection_name: 'test-objects',
				database_name: LIB_PATH.join( __dirname, '~temp' ),
				clear_collection_on_start: true,
				// flush_on_update: true, // For troubleshooting the tests.
			}
		};
		let managed_storage = LIB_MANAGED_STORAGE.NewManagedStorage( managed_config );


		//---------------------------------------------------------------------
		describe( `Collection Tests; ${test_object_count} objects`,
			function ()
			{


				//---------------------------------------------------------------------
				it( `Should create test objects`,
					async function ()
					{
						await LIB_MANAGED_STORAGE_TESTS.CreateTestObjects( managed_storage, Alice, session_id, test_object_count );
						return;
					} );


				//---------------------------------------------------------------------
				it( `Should read and write test objects`,
					async function ()
					{
						await LIB_MANAGED_STORAGE_TESTS.ReadAndWriteTestObjects( managed_storage, Alice, session_id, test_object_count );
						return;
					} );


				//---------------------------------------------------------------------
				it( `Should find all test objects`,
					async function ()
					{
						await LIB_MANAGED_STORAGE_TESTS.FindAllTestObjects( managed_storage, Alice, session_id, test_object_count );
						return;
					} );


				//---------------------------------------------------------------------
				it( `Should delete all test objects`,
					async function ()
					{
						await LIB_MANAGED_STORAGE_TESTS.DeleteAllTestObjects( managed_storage, Alice, session_id, test_object_count );
						return;
					} );


				return;
			} );


		return;
	} );
