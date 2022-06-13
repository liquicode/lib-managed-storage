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


//=====================================================================
//=====================================================================
/***
 *                                                                                                           
 *      ,ad8888ba,                               ad88  88                                                    
 *     d8"'    `"8b                             d8"    ""                                                    
 *    d8'                                       88                                                           
 *    88              ,adPPYba,   8b,dPPYba,  MM88MMM  88   ,adPPYb,d8  88       88  8b,dPPYba,   ,adPPYba,  
 *    88             a8"     "8a  88P'   `"8a   88     88  a8"    `Y88  88       88  88P'   "Y8  a8P_____88  
 *    Y8,            8b       d8  88       88   88     88  8b       88  88       88  88          8PP"""""""  
 *     Y8a.    .a8P  "8a,   ,a8"  88       88   88     88  "8a,   ,d88  "8a,   ,a88  88          "8b,   ,aa  
 *      `"Y8888Y"'    `"YbbdP"'   88       88   88     88   `"YbbdP"Y8   `"YbbdP'Y8  88           `"Ybbd8"'  
 *                                                          aa,    ,88                                       
 *                                                           "Y8bbdP"                                        
 */
//=====================================================================
//=====================================================================


exports.DefaultConfiguration =
	function DefaultConfiguration()
	{
		return {
			// Managed Storage Configuration
			throw_permission_errors: false,
			// MongoDB Provider Configuration
			mongodb: {
				enabled: false,
				collection_name: 'Collection-Name',
				database_name: 'Database-Name',
				connection_string: 'mongodb://<username>:<password>@<server-address',
			},
			// Json Provider Configuration
			json: {
				enabled: false,
				collection_name: 'Collection-Name',
				database_name: '/path/to/store/collections',
				flush_on_update: false,
				flush_every_ms: 0,
			},
			// // Object Management
			// object: {
			// 	title: 'Object',
			// 	titles: 'Objects',
			// 	fields: [],
			// },
			// // Interface Authorization
			// interface: {
			// 	Count: {
			// 		name: 'Count',
			// 		requires_login: false,
			// 		allowed_roles: [],
			// 	},
			// 	List: {
			// 		name: 'List',
			// 		requires_login: false,
			// 		allowed_roles: [],
			// 	},
			// 	FindOne: {
			// 		name: 'FindOne',
			// 		requires_login: false,
			// 		allowed_roles: [],
			// 	},
			// 	FindMany: {
			// 		name: 'FindMany',
			// 		requires_login: false,
			// 		allowed_roles: [],
			// 	},
			// 	CreateOne: {
			// 		name: 'CreateOne',
			// 		requires_login: false,
			// 		allowed_roles: [],
			// 	},
			// 	ReadOne: {
			// 		name: 'ReadOne',
			// 		requires_login: false,
			// 		allowed_roles: [],
			// 	},
			// 	WriteOne: {
			// 		name: 'WriteOne',
			// 		requires_login: false,
			// 		allowed_roles: [],
			// 	},
			// 	DeleteOne: {
			// 		name: 'DeleteOne',
			// 		requires_login: false,
			// 		allowed_roles: [],
			// 	},
			// 	DeleteMany: {
			// 		name: 'DeleteMany',
			// 		requires_login: false,
			// 		allowed_roles: [],
			// 	},
			// },
		};
	};


//=====================================================================
//=====================================================================
/***
 *                                                                                     
 *     ad88888ba                                                                       
 *    d8"     "8b  ,d                                                                  
 *    Y8,          88                                                                  
 *    `Y8aaaaa,  MM88MMM  ,adPPYba,   8b,dPPYba,  ,adPPYYba,   ,adPPYb,d8   ,adPPYba,  
 *      `"""""8b,  88    a8"     "8a  88P'   "Y8  ""     `Y8  a8"    `Y88  a8P_____88  
 *            `8b  88    8b       d8  88          ,adPPPPP88  8b       88  8PP"""""""  
 *    Y8a     a8P  88,   "8a,   ,a8"  88          88,    ,88  "8a,   ,d88  "8b,   ,aa  
 *     "Y88888P"   "Y888  `"YbbdP"'   88          `"8bbdP"Y8   `"YbbdP"Y8   `"Ybbd8"'  
 *                                                             aa,    ,88              
 *                                                              "Y8bbdP"               
 */
//=====================================================================
//=====================================================================


exports.NewManagedStorage =
	function NewManagedStorage( StorageConfiguration = {} )
	{
		let managed_storage = {};


		//=====================================================================
		//=====================================================================
		/***
		 *                                                                                                
		 *    88888888ba                                         88           88                          
		 *    88      "8b                                        ""           88                          
		 *    88      ,8P                                                     88                          
		 *    88aaaaaa8P'  8b,dPPYba,   ,adPPYba,   8b       d8  88   ,adPPYb,88   ,adPPYba,  8b,dPPYba,  
		 *    88""""""'    88P'   "Y8  a8"     "8a  `8b     d8'  88  a8"    `Y88  a8P_____88  88P'   "Y8  
		 *    88           88          8b       d8   `8b   d8'   88  8b       88  8PP"""""""  88          
		 *    88           88          "8a,   ,a8"    `8b,d8'    88  "8a,   ,d88  "8b,   ,aa  88          
		 *    88           88           `"YbbdP"'       "8"      88   `"8bbdP"Y8   `"Ybbd8"'  88          
		 *                                                                                                
		 *                                                                                                
		 */
		//=====================================================================
		//=====================================================================


		// Get the storage provider.
		let storage_provider = null;
		if ( StorageConfiguration.mongodb && StorageConfiguration.mongodb.enabled )
		{
			storage_provider = LIB_MONGO_PROVIDER.NewMongoProvider( StorageConfiguration.mongodb );
		}
		else if ( StorageConfiguration.json && StorageConfiguration.json.enabled )
		{
			storage_provider = LIB_JSON_PROVIDER.NewJsonProvider( StorageConfiguration.json );
		}
		else
		{
			storage_provider = LIB_JSON_PROVIDER.NewJsonProvider();
		}


		//=====================================================================
		//=====================================================================
		/***
		 *                                                                      
		 *      ,ad8888ba,    88           88                                   
		 *     d8"'    `"8b   88           ""                            ,d     
		 *    d8'        `8b  88                                         88     
		 *    88          88  88,dPPYba,   88   ,adPPYba,   ,adPPYba,  MM88MMM  
		 *    88          88  88P'    "8a  88  a8P_____88  a8"     ""    88     
		 *    Y8,        ,8P  88       d8  88  8PP"""""""  8b            88     
		 *     Y8a.    .a8P   88b,   ,a8"  88  "8b,   ,aa  "8a,   ,aa    88,    
		 *      `"Y8888Y"'    8Y"Ybbd8"'   88   `"Ybbd8"'   `"Ybbd8"'    "Y888  
		 *                                ,88                                   
		 *                              888P"                                   
		 */
		//=====================================================================
		//=====================================================================


		//---------------------------------------------------------------------
		managed_storage.NewManagedObject =
			function _NewManagedObject( Owner, Prototype ) 
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

				// // Apply the object definitions.
				// let storage_configuration = StorageConfiguration;
				// if ( storage_configuration.object && storage_configuration.object.fields && storage_configuration.object.fields.length )
				// {
				// 	for ( let index = 0; index < storage_configuration.object.fields.length; index++ )
				// 	{
				// 		let field = storage_configuration.object.fields[ index ];
				// 		managed_object._o[ field.member ] = null;
				// 		if ( field.type === 'string' ) { managed_object._o[ field.member ] = ''; }
				// 		else if ( field.type === 'date' ) { managed_object._o[ field.member ] = ''; }
				// 		else if ( field.type === 'url' ) { managed_object._o[ field.member ] = ''; }
				// 		else if ( field.type === 'image_url' ) { managed_object._o[ field.member ] = ''; }
				// 		else if ( field.type === 'number' ) { managed_object._o[ field.member ] = 0; }
				// 		else if ( field.type === 'array' ) { managed_object._o[ field.member ] = []; }
				// 		else if ( field.type === 'object' ) { managed_object._o[ field.member ] = {}; }
				// 	}
				// }

				// Return the managed object.
				return managed_object;
			};


		//=====================================================================
		//=====================================================================
		/***
		 *                                                                                                            
		 *           db                              88                                    88                         
		 *          d88b                      ,d     88                                    ""                         
		 *         d8'`8b                     88     88                                                               
		 *        d8'  `8b     88       88  MM88MMM  88,dPPYba,    ,adPPYba,   8b,dPPYba,  88  888888888   ,adPPYba,  
		 *       d8YaaaaY8b    88       88    88     88P'    "8a  a8"     "8a  88P'   "Y8  88       a8P"  a8P_____88  
		 *      d8""""""""8b   88       88    88     88       88  8b       d8  88          88    ,d8P'    8PP"""""""  
		 *     d8'        `8b  "8a,   ,a88    88,    88       88  "8a,   ,a8"  88          88  ,d8"       "8b,   ,aa  
		 *    d8'          `8b  `"YbbdP'Y8    "Y888  88       88   `"YbbdP"'   88          88  888888888   `"Ybbd8"'  
		 *                                                                                                            
		 *                                                                                                            
		 */
		//=====================================================================
		//=====================================================================

		//---------------------------------------------------------------------
		// managed_storage.InterfaceRoles = {
		// 	CountAll: {
		// 		name: 'CountAll',
		// 		requires_login: false,
		// 		allowed_roles: [],
		// 	},
		// 	CountMine: {
		// 		name: 'CountMine',
		// 		requires_login: false,
		// 		allowed_roles: [],
		// 	},
		// 	ListAll: {
		// 		name: 'ListAll',
		// 		requires_login: false,
		// 		allowed_roles: [],
		// 	},
		// 	ListMine: {
		// 		name: 'ListMine',
		// 		requires_login: false,
		// 		allowed_roles: [],
		// 	},
		// 	CreateOne: {
		// 		name: 'CreateOne',
		// 		requires_login: false,
		// 		allowed_roles: [],
		// 	},
		// 	ReadOne: {
		// 		name: 'ReadOne',
		// 		requires_login: false,
		// 		allowed_roles: [],
		// 	},
		// 	WriteOne: {
		// 		name: 'WriteOne',
		// 		requires_login: false,
		// 		allowed_roles: [],
		// 	},
		// 	DeleteOne: {
		// 		name: 'DeleteOne',
		// 		requires_login: false,
		// 		allowed_roles: [],
		// 	},
		// 	DeleteMine: {
		// 		name: 'DeleteMine',
		// 		requires_login: false,
		// 		allowed_roles: [],
		// 	},
		// 	DeleteAll: {
		// 		name: 'DeleteAll',
		// 		requires_login: false,
		// 		allowed_roles: [],
		// 	},
		// };


		// //---------------------------------------------------------------------
		// // Returns the role of the user when accessing this object.
		// // Returns one of: 'admin', 'super', 'owner', 'partner', or none ''.
		// // managed_storage.GetObjectAuthorization =
		// function _GetObjectAuthorization( User, ManagedObject )
		// {
		// 	if ( !User ) { return ''; }
		// 	if ( !User.role ) { return ''; }

		// 	// Check for system-wide access.
		// 	if ( User.user_role === 'admin' ) { return 'admin'; }
		// 	if ( User.user_role === 'super' ) { return 'super'; }

		// 	// Must be a user.
		// 	if ( User.user_role !== 'user' ) { throw new Error( `Unknown user role [${User.user_role}].` ); }

		// 	if ( !ManagedObject ) { return 'user'; }
		// 	if ( !ManagedObject._m ) { return 'user'; }
		// 	if ( !ManagedObject._m.owner_id ) { return 'user'; }

		// 	// Check for owner access.
		// 	if ( ManagedObject._m.owner_id === User.user_id ) { return 'owner'; }

		// 	// Check for partner access.
		// 	if ( ManagedObject._m.partners && ManagedObject._m.partners.length )
		// 	{
		// 		for ( let index = 0; index < ManagedObject._m.partners.length; index++ )
		// 		{
		// 			if ( ManagedObject._m.partners[ index ] === User.user_id ) { return 'partner'; }
		// 		}
		// 	}

		// 	// Anonymnous.
		// 	return '';
		// };


		// //---------------------------------------------------------------------
		// // managed_storage.AuthorizeFunction =
		// function _AuthorizeFunction( User, ManagedFunction )
		// {
		// 	let as_role = _GetObjectAuthorization( User, null );
		// 	if ( ManagedFunction.allowed_roles.length === 0 ) { return as_role; }
		// 	if ( ManagedFunction.allowed_roles.includes( as_role ) ) { return as_role; }
		// 	return '';
		// };


		//=====================================================================
		//=====================================================================
		/***
		 *                                                                                                 
		 *    88                                                 ad88                                      
		 *    88                ,d                              d8"                                        
		 *    88                88                              88                                         
		 *    88  8b,dPPYba,  MM88MMM  ,adPPYba,  8b,dPPYba,  MM88MMM  ,adPPYYba,   ,adPPYba,   ,adPPYba,  
		 *    88  88P'   `"8a   88    a8P_____88  88P'   "Y8    88     ""     `Y8  a8"     ""  a8P_____88  
		 *    88  88       88   88    8PP"""""""  88            88     ,adPPPPP88  8b          8PP"""""""  
		 *    88  88       88   88,   "8b,   ,aa  88            88     88,    ,88  "8a,   ,aa  "8b,   ,aa  
		 *    88  88       88   "Y888  `"Ybbd8"'  88            88     `"8bbdP"Y8   `"Ybbd8"'   `"Ybbd8"'  
		 *                                                                                                 
		 *                                                                                                 
		 */
		//=====================================================================
		//=====================================================================


		// // Discovery Functions.
		// managed_storage.CountAll = function ( User ) { throw new Error( 'CountAll is a virtual function.' ); };
		// managed_storage.CountMine = function ( User ) { throw new Error( 'CountMine is a virtual function.' ); };
		// managed_storage.ListAll = function ( User ) { throw new Error( 'ListAll is a virtual function.' ); };
		// managed_storage.ListMine = function ( User ) { throw new Error( 'ListMine is a virtual function.' ); };
		// managed_storage.FindOne = function ( User, Criteria ) { throw new Error( 'FindOne is a virtual function.' ); };
		// managed_storage.FindMany = function ( User, Criteria ) { throw new Error( 'FindMany is a virtual function.' ); };

		// // Manipulation Functions.
		// managed_storage.CreateOne = function ( User, Prototype ) { throw new Error( 'CreateOne is a virtual function.' ); };
		// managed_storage.ReadOne = function ( User, ManagedObjectID ) { throw new Error( 'ReadOne is a virtual function.' ); };
		// managed_storage.WriteOne = function ( User, ManagedObject ) { throw new Error( 'WriteOne is a virtual function.' ); };
		// managed_storage.DeleteOne = function ( User, ManagedObjectID ) { throw new Error( 'DeleteOne is a virtual function.' ); };
		// managed_storage.DeleteMine = function ( User ) { throw new Error( 'DeleteMine is a virtual function.' ); };
		// managed_storage.DeleteAll = function ( User ) { throw new Error( 'DeleteAll is a virtual function.' ); };


		// //---------------------------------------------------------------------
		// function _ValidateUser( User )
		// {
		// 	if ( LIB_UTILS.value_missing_null_empty( User ) ) { return `Missing parameter: User`; }
		// 	if ( LIB_UTILS.value_missing_null_empty( User.user_id ) ) { return `Missing Parameter: User.user_id`; }
		// 	if ( LIB_UTILS.value_missing_null_empty( User.user_role ) ) { return `Missing Parameter: User.user_role`; }
		// 	return '';
		// }


		// //---------------------------------------------------------------------
		// function _GetUserCriteria( User, Criteria )
		// {
		// 	let criteria = {};
		// 	if ( !LIB_UTILS.value_missing_null_empty( Criteria ) )
		// 	{
		// 		criteria._o = LIB_UTILS.clone( Criteria );
		// 	}
		// 	if ( User.user_role === 'admin' ) { }
		// 	else if ( User.user_role === 'super' ) { }
		// 	else if ( User.user_role === 'user' )
		// 	{
		// 		criteria.$or = [
		// 			{ '_m.owner_id': User.user_id },
		// 			{ '_m.partners': User.user_id },
		// 			{ '_m.public': true },
		// 		];
		// 	}
		// 	else
		// 	{
		// 		throw new Error( `Unknown user role [${User.user_role}].` );
		// 	}
		// 	return criteria;
		// }


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
			if ( LIB_UTILS.value_missing_null_empty( ManagedObject._m.owner_id ) ) { throw LIB_UTILS.MISSING_PARAMETER_ERROR( 'ManagedObject._m.owner_id' ); }
			if ( LIB_UTILS.value_missing( ManagedObject._m.readers ) ) { throw LIB_UTILS.MISSING_PARAMETER_ERROR( 'ManagedObject._m.readers' ); }
			if ( LIB_UTILS.value_missing( ManagedObject._m.writers ) ) { throw LIB_UTILS.MISSING_PARAMETER_ERROR( 'ManagedObject._m.writers' ); }
			if ( LIB_UTILS.value_missing( ManagedObject._m.public ) ) { throw LIB_UTILS.MISSING_PARAMETER_ERROR( 'ManagedObject._m.public' ); }
			return;
		}


		// //---------------------------------------------------------------------
		// function _UserCanRead( User, ManagedObject )
		// {
		// 	_ValidateUser( User );
		// 	_ValidateManagedObject( ManagedObject );
		// 	if ( ManagedObject._m.public ) { return true; }
		// 	if ( User.user_role === 'admin' ) { return true; }
		// 	if ( User.user_role === 'super' ) { return true; }
		// 	if ( User.user_role === 'user' ) 
		// 	{
		// 		if ( User.user_id === ManagedObject._m.owner_id ) { return true; }
		// 		if ( ManagedObject._m.readers.includes( User.user_id ) ) { return true; }
		// 		if ( ManagedObject._m.writers.includes( User.user_id ) ) { return true; }
		// 	}
		// 	return false;
		// }


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
		// Build criteria that will match objects to which this user is an owner, reader, or writer.
		function _ManagedCriteria( User, Criteria, ObjectID )
		{
			_ValidateUser( User );

			// Construct the query criteria.
			let criteria = {};

			// Use the ObjectID field.
			if ( !LIB_UTILS.value_missing_null_empty( ObjectID ) )
			{
				criteria._m = { id: ObjectID }; // Match a single, specific object.
			}

			// Apply user supplied criteria.
			if ( !LIB_UTILS.value_missing_null_empty( Criteria ) )
			{
				criteria._o = LIB_UTILS.clone( Criteria );
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


		//---------------------------------------------------------------------
		// Build criteria to match a single specific object.
		function _ObjectIDCriteria( ManagedObject )
		{
			_ValidateManagedObject( ManagedObject );
			let criteria = { _m: { id: ManagedObject._m.id } };
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
					let criteria = _ManagedCriteria( User, Criteria, null );
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
			async function FindOne( User, CriteriaOrID )
			{
				try
				{
					let criteria = null;
					if ( typeof CriteriaOrID === 'string' )
					{
						criteria = _ObjectIDCriteria( { _m: { id: CriteriaOrID } } );
					}
					else
					{
						criteria = _ManagedCriteria( User, CriteriaOrID, null );
					}
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
					let criteria = _ManagedCriteria( User, Criteria, null );
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
					let managed_object = managed_storage.NewManagedObject( User, Prototype );
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
			async function WriteOne( User, ManagedObject )
			{
				try
				{
					_ValidateManagedObject( ManagedObject );
					let criteria = _ManagedCriteria( User, null, ManagedObject._m.id );
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
					found_object._m.updated_at = LIB_UTILS.zulu_timestamp();
					found_object._o = LIB_UTILS.merge_objects( found_object._o, ManagedObject._o );
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
			async function DeleteOne( User, CriteriaOrID )
			{
				try
				{
					let criteria = null;
					if ( typeof CriteriaOrID === 'string' )
					{
						criteria = _ObjectIDCriteria( { _m: { id: CriteriaOrID } } );
					}
					else
					{
						criteria = _ManagedCriteria( User, CriteriaOrID, null );
					}
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
					return await storage_provider.DeleteOne( _ObjectIDCriteria( found_object ) );
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
					let criteria = _ManagedCriteria( User, Criteria, null );
					let found_objects = await storage_provider.FindMany( criteria );
					let deleted_count = 0;
					for ( let index = 0; index < found_objects.length; index++ )
					{
						let found_object = found_objects[ index ];
						if ( _UserCanWrite( User, found_object ) )
						{
							let count = await storage_provider.DeleteOne( _ObjectIDCriteria( found_object ) );
							if ( !count ) { throw new Error( `There was an unexpected problem deleting the object.` ); }
							deleted_count++;
						}
					}
					return deleted_count;
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
			async function SetOwner( User, CriteriaOrID )
			{
				try
				{
					let criteria = null;
					if ( typeof CriteriaOrID === 'string' )
					{
						criteria = _ObjectIDCriteria( { _m: { id: CriteriaOrID } } );
					}
					else
					{
						criteria = _ManagedCriteria( User, CriteriaOrID, null );
					}
					let found_object = await storage_provider.FindOne( criteria );
					if ( !found_object ) 
					{
						if ( StorageConfiguration.throw_permission_errors ) { throw LIB_UTILS.READ_ACCESS_ERROR(); }
						else { return 0; }
					}
					// if ( !_UserCanWrite( User, found_object ) ) 
					// {
					// 	if ( StorageConfiguration.throw_permission_errors ) { throw LIB_UTILS.WRITE_ACCESS_ERROR(); }
					// 	else { return 0; }
					// }
					found_object._m.owner_id = User.user_id;
					return await storage_provider.WriteOne( found_object );
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
			async function Share( User, ManagedObjectOrID, Readers, Writers, MakePublic )
			{
				try
				{
					// Get the criteria.
					let criteria = null;
					if ( typeof ManagedObjectOrID === 'string' )
					{
						criteria = _ObjectIDCriteria( { _m: { id: ManagedObjectOrID } } );
					}
					else
					{
						_ValidateManagedObject( ManagedObjectOrID );
						criteria = _ManagedCriteria( User, null, ManagedObjectOrID._m.id );
					}

					// Find the object.				
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
					if ( !modified ) { return 1; }

					// Write the object.
					found_object._m.updated_at = LIB_UTILS.zulu_timestamp();
					let count = await storage_provider.WriteOne( found_object );
					return count;
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
			async function Unshare( User, ManagedObjectOrID, NotReaders, NotWriters, MakeNotPublic )
			{
				try
				{
					// Get the criteria.
					let criteria = null;
					if ( typeof ManagedObjectOrID === 'string' )
					{
						criteria = _ObjectIDCriteria( { _m: { id: ManagedObjectOrID } } );
					}
					else
					{
						_ValidateManagedObject( ManagedObjectOrID );
						criteria = _ManagedCriteria( User, null, ManagedObjectOrID._m.id );
					}

					// Find the object.				
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
					if ( !modified ) { return 1; }

					// Write the object.
					found_object._m.updated_at = LIB_UTILS.zulu_timestamp();
					let count = await storage_provider.WriteOne( found_object );
					return count;
				}
				catch ( error )
				{
					throw error;
				}
			};


		//=====================================================================
		//=====================================================================
		/***
		 *                                                                             
		 *    88888888888  88                           88  88                         
		 *    88           ""                           88  ""                         
		 *    88                                        88                             
		 *    88aaaaa      88  8b,dPPYba,   ,adPPYYba,  88  88  888888888   ,adPPYba,  
		 *    88"""""      88  88P'   `"8a  ""     `Y8  88  88       a8P"  a8P_____88  
		 *    88           88  88       88  ,adPPPPP88  88  88    ,d8P'    8PP"""""""  
		 *    88           88  88       88  88,    ,88  88  88  ,d8"       "8b,   ,aa  
		 *    88           88  88       88  `"8bbdP"Y8  88  88  888888888   `"Ybbd8"'  
		 *                                                                             
		 *                                                                             
		 */
		//=====================================================================
		//=====================================================================


		//=====================================================================
		managed_storage.SystemAdministrator = {
			name: 'System Administrator',
			user_id: 'admin@system',
			user_role: 'admin',
		};


		return managed_storage;
	};




