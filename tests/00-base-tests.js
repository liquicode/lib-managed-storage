"use strict";


const LIB = require( '../src/template-lib.js' );
const LIB_ASSERT = require( 'assert' );

//---------------------------------------------------------------------
describe( `00) Base Tests`,
	function ()
	{


		//---------------------------------------------------------------------
		describe( `Assert Tests`,
			async function ()
			{

				//---------------------------------------------------------------------
				it( `LIB_ASSERT.ok( true )`,
					async function ()
					{
						LIB_ASSERT.ok( true );
						return;
					} );

				//---------------------------------------------------------------------
				it( `LIB_ASSERT.strictEqual( 1, 1 )`,
					async function ()
					{
						LIB_ASSERT.strictEqual( 1, 1 );
						return;
					} );

				//---------------------------------------------------------------------
				it( `LIB_ASSERT.notStrictEqual( 0, 1 )`,
					async function ()
					{
						LIB_ASSERT.notStrictEqual( 0, 1 );
						return;
					} );

				return;
			} );


		//---------------------------------------------------------------------
		describe( `Library Tests`,
			async function ()
			{

				//---------------------------------------------------------------------
				it( `returns 1 when called with no arguments`,
					async function ()
					{
						let value = LIB.Product( [] );
						LIB_ASSERT.strictEqual( value, 1 );
						return;
					} );

				//---------------------------------------------------------------------
				it( `returns the argument when called with a single argument`,
					async function ()
					{
						let value = LIB.Product( [ 42 ] );
						LIB_ASSERT.strictEqual( value, 42 );
						return;
					} );

				//---------------------------------------------------------------------
				it( `handles two arguments`,
					async function ()
					{
						let value = LIB.Product( [ 6, 7 ] );
						LIB_ASSERT.strictEqual( value, 42 );
						return;
					} );

				//---------------------------------------------------------------------
				it( `handles multiple arguments`,
					async function ()
					{
						let value = LIB.Product( [ 3, 4, 5 ] );
						LIB_ASSERT.strictEqual( value, ( 3 * 4 * 5 ) );
						return;
					} );

				return;
			} );


		return;
	} );
