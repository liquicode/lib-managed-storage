"use strict";


//---------------------------------------------------------------------
function value_missing_null_empty( Value )
{
	if ( Value === null ) { return true; }
	switch ( typeof Value )
	{
		case 'undefined':
			return true;
		case 'string':
			if ( Value.length === 0 ) { return true; }
		case 'object':
			if ( Value === null ) { return true; }
			if ( Object.keys( Value ).length === 0 ) { return true; }
			break;
	}
	return false;
};


//---------------------------------------------------------------------
function value_exists( Value )
{
	return !value_missing_null_empty( Value );
};


//---------------------------------------------------------------------
function missing_parameter_error( Name )
{
	return new Error( `Required parameter is missing: ${Name}` );
};


//---------------------------------------------------------------------
function clone( Value )
{
	return JSON.parse( JSON.stringify( Value ) );
};


//---------------------------------------------------------------------
function merge_objects( ObjectA, ObjectB )
{
	let C = JSON.parse( JSON.stringify( ObjectA ) );

	function update_children( ParentA, ParentB )
	{
		Object.keys( ParentB ).forEach(
			key =>
			{
				let value = ParentB[ key ];
				if ( typeof ParentA[ key ] === 'undefined' )
				{
					ParentA[ key ] = JSON.parse( JSON.stringify( value ) );
				}
				else
				{
					if ( typeof value === 'object' )
					{
						// Merge objects.
						update_children( ParentA[ key ], value );
					}
					else
					{
						// Overwrite values.
						ParentA[ key ] = JSON.parse( JSON.stringify( value ) );
					}
				}
			} );
	}

	update_children( C, ObjectB );
	return C;
};


//---------------------------------------------------------------------
function zulu_timestamp()
{
	return ( new Date() ).toISOString();
};


//---------------------------------------------------------------------

exports.value_missing_null_empty = value_missing_null_empty;
exports.value_exists = value_exists;
exports.missing_parameter_error = missing_parameter_error;

exports.clone = clone;
exports.merge_objects = merge_objects;

exports.zulu_timestamp = zulu_timestamp;
