"use strict";


const LIB_UUID = require( 'uuid' );

const LIB_UTILS = require( './lib-utils.js' );
const LIB_MONGO_PROVIDER = require( './StorageProviders/MongoProvider.js' );
const LIB_JSON_PROVIDER = require( './StorageProviders/JsonProvider.js' );


//=====================================================================
//=====================================================================
//
//		LIB-MANAGED-STORAGE
//
//=====================================================================
//=====================================================================


const LIB_MANAGED_STORAGE = {};


//=====================================================================
// DefaultConfiguration
//=====================================================================


LIB_MANAGED_STORAGE.DefaultConfiguration =
	function ()
	{
		return {
			// Managed Storage Configuration
			throw_permission_errors: false,
			// MongoDB Provider Configuration
			mongo_provider: {
				enabled: false,
				collection_name: 'Collection-Name',
				database_name: 'Database-Name',
				connection_string: 'mongodb://<username>:<password>@<server-address',
			},
			// Json Provider Configuration
			json_provider: {
				enabled: false,
				collection_name: 'Collection-Name',
				database_name: '/path/to/store/collections',
				clear_collection_on_start: false,
				flush_on_update: false,
				flush_every_ms: 0,
			},
		};
	};
exports.DefaultConfiguration = LIB_MANAGED_STORAGE.DefaultConfiguration;


//=====================================================================
// Storage Administrator
//=====================================================================


LIB_MANAGED_STORAGE.StorageAdministrator =
	function ()
	{
		return {
			name: 'Storage Administrator',
			user_id: 'admin@storage',
			user_role: 'admin',
		};
	};
exports.StorageAdministrator = LIB_MANAGED_STORAGE.StorageAdministrator;


//=====================================================================
// NewManagedObject
//=====================================================================


LIB_MANAGED_STORAGE.NewManagedObject =
	function ( Owner, Prototype ) 
	{
		if ( !LIB_UTILS.value_exists( Owner ) ) { throw LIB_UTILS.MISSING_PARAMETER_ERROR( 'Owner' ); }
		if ( !LIB_UTILS.value_exists( Owner.user_id ) ) { throw LIB_UTILS.MISSING_PARAMETER_ERROR( 'Owner.user_id' ); }

		// Create a new managed object.
		let managed_object = {
			_m: {
				id: LIB_UUID.v4(),
				created_at: LIB_UTILS.zulu_timestamp(),
				updated_at: LIB_UTILS.zulu_timestamp(),
				owner_id: Owner.user_id,
				readers: [],
				writers: [],
				public: false,
			},
			_o: LIB_UTILS.clone( Prototype ),
		};

		// Return the managed object.
		return managed_object;
	};
exports.NewManagedObject = LIB_MANAGED_STORAGE.NewManagedObject;


//=====================================================================
// NewManagedStorage
//=====================================================================


LIB_MANAGED_STORAGE.NewManagedStorage =
	function NewManagedStorage( StorageConfiguration = {} )
	{
		let managed_storage = {};


		//=====================================================================
		// Storage Provider
		//=====================================================================


		// Get the storage provider.
		let storage_provider = null;
		if ( StorageConfiguration.mongo_provider && StorageConfiguration.mongo_provider.enabled )
		{
			storage_provider = LIB_MONGO_PROVIDER.NewMongoProvider( StorageConfiguration.mongo_provider );
		}
		else if ( StorageConfiguration.json_provider && StorageConfiguration.json_provider.enabled )
		{
			storage_provider = LIB_JSON_PROVIDER.NewJsonProvider( StorageConfiguration.json_provider );
		}
		else
		{
			storage_provider = LIB_JSON_PROVIDER.NewJsonProvider();
		}


		//=====================================================================
		// Storage Interface
		//=====================================================================


		//---------------------------------------------------------------------
		function _ValidateUser( User )
		{
			if ( LIB_UTILS.value_missing_null_empty( User ) ) { throw LIB_UTILS.MISSING_PARAMETER_ERROR( 'User' ); }
			if ( LIB_UTILS.value_missing_null_empty( User.user_id ) ) { throw LIB_UTILS.MISSING_PARAMETER_ERROR( 'User.user_id' ); }
			if ( LIB_UTILS.value_missing_null_empty( User.user_role ) ) { throw LIB_UTILS.MISSING_PARAMETER_ERROR( 'User.user_role' ); }
			if ( ![ 'admin', 'super', 'user' ].includes( User.user_role ) ) { throw new Error( `Unknown value for User.user_role: [${User.user_role}]` ); }
			return;
		}


		//---------------------------------------------------------------------
		function _ValidateManagedObject( ManagedObject )
		{
			if ( LIB_UTILS.value_missing_null_empty( ManagedObject ) ) { throw LIB_UTILS.MISSING_PARAMETER_ERROR( 'ManagedObject' ); }
			if ( LIB_UTILS.value_missing_null_empty( ManagedObject._m ) ) { throw LIB_UTILS.MISSING_PARAMETER_ERROR( 'ManagedObject._m' ); }
			if ( LIB_UTILS.value_missing_null_empty( ManagedObject._m.id ) ) { throw LIB_UTILS.MISSING_PARAMETER_ERROR( 'ManagedObject._m.id' ); }
			if ( LIB_UTILS.value_missing_null_empty( ManagedObject._m.owner_id ) ) { throw LIB_UTILS.MISSING_PARAMETER_ERROR( 'ManagedObject._m.owner_id' ); }
			if ( LIB_UTILS.value_missing( ManagedObject._m.readers ) ) { throw LIB_UTILS.MISSING_PARAMETER_ERROR( 'ManagedObject._m.readers' ); }
			if ( LIB_UTILS.value_missing( ManagedObject._m.writers ) ) { throw LIB_UTILS.MISSING_PARAMETER_ERROR( 'ManagedObject._m.writers' ); }
			if ( LIB_UTILS.value_missing( ManagedObject._m.public ) ) { throw LIB_UTILS.MISSING_PARAMETER_ERROR( 'ManagedObject._m.public' ); }
			return;
		}


		//---------------------------------------------------------------------
		function _UserCanWrite( User, ManagedObject )
		{
			_ValidateUser( User );
			_ValidateManagedObject( ManagedObject );
			if ( User.user_role === 'admin' ) { return true; }
			if ( User.user_role === 'super' ) { return true; }
			if ( User.user_role === 'user' ) 
			{
				if ( User.user_id === ManagedObject._m.owner_id ) { return true; }
				if ( ManagedObject._m.writers.includes( User.user_id ) ) { return true; }
			}
			return false;
		}


		//---------------------------------------------------------------------
		function _ManagedCriteria( User, ObjectOrID )
		{
			_ValidateUser( User );

			// Construct the query criteria.
			let criteria = {};

			let object_type = ( typeof ObjectOrID );
			if ( object_type === 'string' )
			{
				criteria._m = { id: ObjectOrID }; // Match a single, specific object.
			}
			else if ( object_type === 'object' )
			{
				if ( ObjectOrID === null )
				{
					// Do nothing.
				}
				else
				{
					if ( !LIB_UTILS.value_missing_null_empty( ObjectOrID._m ) &&
						!LIB_UTILS.value_missing_null_empty( ObjectOrID._m.id ) )
					{
						criteria._m = { id: ObjectOrID._m.id }; // Match a single, specific object.
					}
					else
					{
						if ( !LIB_UTILS.value_missing_null_empty( ObjectOrID._o ) )
						{
							if ( Object.keys( ObjectOrID._o ).length > 0 )
							{
								criteria._o = LIB_UTILS.clone( ObjectOrID._o ); // match _o with the provided values.
							}
						}
						else
						{
							if ( Object.keys( ObjectOrID ).length > 0 )
							{
								criteria._o = LIB_UTILS.clone( ObjectOrID ); // match _o with the provided values.
								delete criteria._o._m;
							}
						}
					}
				}
			}
			else if ( object_type === 'undefined' ) 
			{
				// Do nothing.
			}
			else
			{
				throw new Error( `Unknown parameter type [${object_type}] for [ObjectOrID]. Must be a string, object, null, or undefined.` );
			}

			// Apply role based restrictions.
			if ( User.user_role === 'user' ) 
			{
				criteria.$or = []; // Use a set of optional conditions.
				criteria.$or.push( { '_m.owner_id': User.user_id } ); // Return objects owned by this user.
				criteria.$or.push( { '_m.readers': { $in: User.user_id } } ); // Return objects shared to this user.
				criteria.$or.push( { '_m.writers': { $in: User.user_id } } ); // Return objects shared to this user.
				criteria.$or.push( { '_m.public': true } ); // Return public objects.
			}

			return criteria;
		}


		//=====================================================================
		// Count
		//=====================================================================


		managed_storage.Count =
			async function Count( User, Criteria )
			{
				try
				{
					let criteria = _ManagedCriteria( User, Criteria );
					return await storage_provider.Count( criteria );
				}
				catch ( error )
				{
					throw error;
				}
			};


		//=====================================================================
		// FindOne
		//=====================================================================


		managed_storage.FindOne =
			async function FindOne( User, Criteria )
			{
				try
				{
					let criteria = _ManagedCriteria( User, Criteria );
					let object = await storage_provider.FindOne( criteria );
					if ( object ) { delete object._id; }
					return object;
				}
				catch ( error )
				{
					throw error;
				}
			};


		//=====================================================================
		// FindMany
		//=====================================================================


		managed_storage.FindMany =
			async function FindMany( User, Criteria )
			{
				try
				{
					let criteria = _ManagedCriteria( User, Criteria );
					let objects = await storage_provider.FindMany( criteria );
					objects.forEach( object => { delete object._id; } );
					return objects;
				}
				catch ( error )
				{
					throw error;
				}
			};


		//=====================================================================
		// CreateOne
		//=====================================================================


		managed_storage.CreateOne =
			async function CreateOne( User, Prototype )
			{
				try
				{
					let managed_object = LIB_MANAGED_STORAGE.NewManagedObject( User, Prototype );
					let object = await storage_provider.CreateOne( managed_object );
					if ( object ) { delete object._id; }
					return object;
				}
				catch ( error )
				{
					throw error;
				}
			};


		//=====================================================================
		// WriteOne
		//=====================================================================


		managed_storage.WriteOne =
			async function WriteOne( User, Criteria, DataObject )
			{
				try
				{
					let criteria = _ManagedCriteria( User, Criteria );
					let found_object = await storage_provider.FindOne( criteria );
					if ( !found_object ) 
					{
						if ( StorageConfiguration.throw_permission_errors ) { throw LIB_UTILS.READ_ACCESS_ERROR(); }
						else { return 0; }
					}
					if ( !_UserCanWrite( User, found_object ) ) 
					{
						if ( StorageConfiguration.throw_permission_errors ) { throw LIB_UTILS.WRITE_ACCESS_ERROR(); }
						else { return 0; }
					}
					if ( !LIB_UTILS.value_missing_null_empty( DataObject._o ) )
					{
						DataObject = DataObject._o;
					}
					found_object._m.updated_at = LIB_UTILS.zulu_timestamp();
					found_object._o = LIB_UTILS.merge_objects( found_object._o, DataObject );
					return await storage_provider.WriteOne( found_object );
				}
				catch ( error )
				{
					throw error;
				}
			};


		//=====================================================================
		// DeleteOne
		//=====================================================================


		managed_storage.DeleteOne =
			async function DeleteOne( User, Criteria )
			{
				try
				{
					let criteria = _ManagedCriteria( User, Criteria );
					let found_object = await storage_provider.FindOne( criteria );
					if ( !found_object ) 
					{
						if ( StorageConfiguration.throw_permission_errors ) { throw LIB_UTILS.READ_ACCESS_ERROR(); }
						else { return 0; }
					}
					if ( !_UserCanWrite( User, found_object ) ) 
					{
						if ( StorageConfiguration.throw_permission_errors ) { throw LIB_UTILS.WRITE_ACCESS_ERROR(); }
						else { return 0; }
					}
					return await storage_provider.DeleteOne( _ManagedCriteria( User, found_object ) );
				}
				catch ( error )
				{
					throw error;
				}
			};


		//=====================================================================
		// DeleteMany
		//=====================================================================


		managed_storage.DeleteMany =
			async function DeleteMany( User, Criteria )
			{
				try
				{
					let criteria = _ManagedCriteria( User, Criteria );
					let operation_count = 0;
					let found_objects = await storage_provider.FindMany( criteria );
					for ( let found_object_index = 0; found_object_index < found_objects.length; found_object_index++ )
					{
						let found_object = found_objects[ found_object_index ];
						if ( _UserCanWrite( User, found_object ) )
						{
							let count = await storage_provider.DeleteOne( _ManagedCriteria( User, found_object ) );
							if ( !count ) { throw new Error( `There was an unexpected problem deleting the object.` ); }
							operation_count++;
						}
					}
					return operation_count;
				}
				catch ( error )
				{
					throw error;
				}
			};


		//=====================================================================
		// SetOwner
		//=====================================================================


		managed_storage.SetOwner =
			async function SetOwner( User, Criteria )
			{
				try
				{
					let criteria = _ManagedCriteria( User, Criteria );
					let operation_count = 0;
					let found_objects = await storage_provider.FindMany( criteria );
					for ( let found_object_index = 0; found_object_index < found_objects.length; found_object_index++ )
					{
						let found_object = found_objects[ found_object_index ];
						if ( _UserCanWrite( User, found_object ) )
						{
							found_object._m.owner_id = User.user_id;
							found_object._m.updated_at = LIB_UTILS.zulu_timestamp();
							operation_count += await storage_provider.WriteOne( found_object );
						}
					}
					return operation_count;
				}
				catch ( error )
				{
					throw error;
				}
			};


		//=====================================================================
		// Share
		//=====================================================================


		managed_storage.Share =
			async function Share( User, Criteria, Readers, Writers, MakePublic )
			{
				try
				{
					let criteria = _ManagedCriteria( User, Criteria );
					let operation_count = 0;
					let found_objects = await storage_provider.FindMany( criteria );
					for ( let found_object_index = 0; found_object_index < found_objects.length; found_object_index++ )
					{
						let found_object = found_objects[ found_object_index ];
						if ( _UserCanWrite( User, found_object ) )
						{
							// Update the object.
							let modified = false;
							if ( !LIB_UTILS.value_missing_null_empty( Readers ) )
							{
								let readers = [];
								if ( typeof Readers === 'string' ) { readers.push( Readers ); }
								else if ( Array.isArray( Readers ) ) { readers = Readers; }
								else { throw new Error( `Invalid value for parameter [Readers], must be a string or array of strings.` ); }
								readers.forEach(
									element =>
									{
										if ( !found_object._m.readers.includes( element ) )
										{
											found_object._m.readers.push( element );
											modified = true;
										}
									} );
							}
							if ( !LIB_UTILS.value_missing_null_empty( Writers ) )
							{
								let writers = [];
								if ( typeof Writers === 'string' ) { writers.push( Writers ); }
								else if ( Array.isArray( Writers ) ) { writers = Writers; }
								else { throw new Error( `Invalid value for parameter [Readers], must be a string or array of strings.` ); }
								writers.forEach(
									element =>
									{
										if ( !found_object._m.writers.includes( element ) )
										{
											found_object._m.writers.push( element );
											modified = true;
										}
									} );
							}
							if ( !LIB_UTILS.value_missing_null_empty( MakePublic ) && MakePublic )
							{
								if ( !found_object._m.public )
								{
									found_object._m.public = true;
									modified = true;
								}
							}

							// Write the object.
							if ( modified )
							{
								found_object._m.updated_at = LIB_UTILS.zulu_timestamp();
								operation_count += await storage_provider.WriteOne( found_object );
							}
						}
					}
					return operation_count;
				}
				catch ( error )
				{
					throw error;
				}
			};


		//=====================================================================
		// Unshare
		//=====================================================================


		managed_storage.Unshare =
			async function Unshare( User, Criteria, NotReaders, NotWriters, MakeNotPublic )
			{
				try
				{
					let criteria = _ManagedCriteria( User, Criteria );
					let operation_count = 0;
					let found_objects = await storage_provider.FindMany( criteria );
					for ( let found_object_index = 0; found_object_index < found_objects.length; found_object_index++ )
					{
						let found_object = found_objects[ found_object_index ];
						if ( _UserCanWrite( User, found_object ) )
						{
							// Update the object.
							let modified = false;
							if ( !LIB_UTILS.value_missing_null_empty( NotReaders ) )
							{
								let not_readers = [];
								if ( typeof NotReaders === 'string' ) { not_readers.push( NotReaders ); }
								else if ( Array.isArray( Readers ) ) { not_readers = NotReaders; }
								else { throw new Error( `Invalid value for parameter [Readers], must be a string or array of strings.` ); }
								not_readers.forEach(
									element =>
									{
										let index = found_object._m.readers.indexOf( element );
										if ( index >= 0 )
										{
											found_object._m.readers.slice( index, 1 );
											modified = true;
										}
									} );
							}
							if ( !LIB_UTILS.value_missing_null_empty( NotWriters ) )
							{
								let not_writers = [];
								if ( typeof NotWriters === 'string' ) { not_writers.push( NotWriters ); }
								else if ( Array.isArray( NotWriters ) ) { not_writers = NotWriters; }
								else { throw new Error( `Invalid value for parameter [Readers], must be a string or array of strings.` ); }
								not_writers.forEach(
									element =>
									{
										let index = found_object._m.writers.indexOf( element );
										if ( index >= 0 )
										{
											found_object._m.writers.slice( index, 1 );
											modified = true;
										}
									} );
							}
							if ( !LIB_UTILS.value_missing_null_empty( MakeNotPublic ) && MakeNotPublic )
							{
								if ( found_object._m.public )
								{
									found_object._m.public = false;
									modified = true;
								}
							}

							// Write the object.
							if ( modified )
							{
								found_object._m.updated_at = LIB_UTILS.zulu_timestamp();
								operation_count += await storage_provider.WriteOne( found_object );
							}
						}
					}
					return operation_count;
				}
				catch ( error )
				{
					throw error;
				}
			};


		//=====================================================================
		// Return Storage
		//=====================================================================


		return managed_storage;


	};
exports.NewManagedStorage = LIB_MANAGED_STORAGE.NewManagedStorage;

