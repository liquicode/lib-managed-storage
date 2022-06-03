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
			// Provider Configuration
			provider: {
				mongodb: {
					enabled: false,
					collection_name: 'Collection-Name',
					database_name: 'Database-Name',
					connection_string: 'mongodb://<username>:<password>@<server-address',
				},
				json: {
					enabled: false,
					collection_name: 'Collection-Name',
					database_name: '/path/to/store/collections',
					flush_on_update: false,
					flush_every_ms: 0,
				},
			},
			// Object Management
			object: {
				title: 'Object',
				titles: 'Objects',
				fields: [],
			},
			// Interface Authorization
			interface: {
				ListAll: {
					name: 'ListAll',
					requires_login: false,
					allowed_roles: [],
				},
				ListMine: {
					name: 'ListMine',
					requires_login: false,
					allowed_roles: [],
				},
				CountAll: {
					name: 'CountAll',
					requires_login: false,
					allowed_roles: [],
				},
				CountMine: {
					name: 'CountMine',
					requires_login: false,
					allowed_roles: [],
				},
				FindOne: {
					name: 'FindOne',
					requires_login: false,
					allowed_roles: [],
				},
				FindMany: {
					name: 'FindMany',
					requires_login: false,
					allowed_roles: [],
				},
				CreateOne: {
					name: 'CreateOne',
					requires_login: false,
					allowed_roles: [],
				},
				ReadOne: {
					name: 'ReadOne',
					requires_login: false,
					allowed_roles: [],
				},
				WriteOne: {
					name: 'WriteOne',
					requires_login: false,
					allowed_roles: [],
				},
				DeleteOne: {
					name: 'DeleteOne',
					requires_login: false,
					allowed_roles: [],
				},
				DeleteMine: {
					name: 'DeleteMine',
					requires_login: false,
					allowed_roles: [],
				},
				DeleteAll: {
					name: 'DeleteAll',
					requires_login: false,
					allowed_roles: [],
				},
			},
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
	function NewManagedStorage( StorageConfiguration )
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
			storage_provider = LIB_MONGO_PROVIDER.NewMongoDbStorageProvider( StorageConfiguration.mongodb );
		}
		// else if ( StorageConfiguration.file && StorageConfiguration.file.enabled )
		// {
		// 	storage_provider = LIB_MONGO_DB_PROVIDER.NewJsonDbfsProvider( StorageConfiguration.file );
		// }
		else if ( StorageConfiguration.memory && StorageConfiguration.memory.enabled )
		{
			storage_provider = LIB_JSON_PROVIDER.NewJsonMemoryProvider( StorageConfiguration.memory );
		}
		else
		{
			throw new Error(`No storage provider is enabled in the configuratrion.`);
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
				if ( !LIB_UTILS.value_exists( Owner ) ) { throw LIB_UTILS.missing_parameter_error( 'Owner' ); }
				if ( !LIB_UTILS.value_exists( Owner.email ) ) { throw LIB_UTILS.missing_parameter_error( 'Owner.email' ); }
				Owner.name = Owner.name || '';

				// Create a new managed object.
				let managed_object = {
					_m: {
						id: LIB_UUID.v4(),
						created_at: LIB_UTILS.zulu_timestamp(),
						updated_at: LIB_UTILS.zulu_timestamp(),
						owner_id: Owner.user_id,
						partners: [],
						public: false,
					},
					_o: {}
				};

				// Apply the object definitions.
				let storage_configuration = StorageConfiguration;
				if ( storage_configuration.object && storage_configuration.object.fields && storage_configuration.object.fields.length )
				{
					for ( let index = 0; index < storage_configuration.object.fields.length; index++ )
					{
						let field = storage_configuration.object.fields[ index ];
						managed_object._o[ field.member ] = null;
						if ( field.type === 'string' ) { managed_object._o[ field.member ] = ''; }
						else if ( field.type === 'date' ) { managed_object._o[ field.member ] = ''; }
						else if ( field.type === 'url' ) { managed_object._o[ field.member ] = ''; }
						else if ( field.type === 'image_url' ) { managed_object._o[ field.member ] = ''; }
						else if ( field.type === 'number' ) { managed_object._o[ field.member ] = 0; }
						else if ( field.type === 'array' ) { managed_object._o[ field.member ] = []; }
						else if ( field.type === 'object' ) { managed_object._o[ field.member ] = {}; }
					}
				}

				// Apply the prototype.
				if ( Prototype )
				{
					let source_object = Prototype;
					if ( source_object._o ) { source_object = source_object._o; }
					let keys = Object.keys( source_object );
					for ( let index = 0; index < keys.length; index++ )
					{
						let key = keys[ index ];
						managed_object._o[ key ] = LIB_UTILS.clone( source_object[ key ] );
					}
				}

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


		//---------------------------------------------------------------------
		// Returns the role of the user when accessing this object.
		// Returns one of: 'admin', 'super', 'owner', 'partner', or none ''.
		// managed_storage.GetObjectAuthorization =
		function _GetObjectAuthorization( User, ManagedObject )
		{
			if ( !User ) { return ''; }
			if ( !User.role ) { return ''; }

			// Check for system-wide access.
			if ( User.user_role === 'admin' ) { return 'admin'; }
			if ( User.user_role === 'super' ) { return 'super'; }

			// Must be a user.
			if ( User.user_role !== 'user' ) { throw new Error( `Unknown user role [${User.user_role}].` ); }

			if ( !ManagedObject ) { return 'user'; }
			if ( !ManagedObject._m ) { return 'user'; }
			if ( !ManagedObject._m.owner_id ) { return 'user'; }

			// Check for owner access.
			if ( ManagedObject._m.owner_id === User.user_id ) { return 'owner'; }

			// Check for partner access.
			if ( ManagedObject._m.partners && ManagedObject._m.partners.length )
			{
				for ( let index = 0; index < ManagedObject._m.partners.length; index++ )
				{
					if ( ManagedObject._m.partners[ index ] === User.user_id ) { return 'partner'; }
				}
			}

			// Anonymnous.
			return '';
		};


		//---------------------------------------------------------------------
		// managed_storage.AuthorizeFunction =
		function _AuthorizeFunction( User, ManagedFunction )
		{
			let as_role = _GetObjectAuthorization( User, null );
			if ( ManagedFunction.allowed_roles.length === 0 ) { return as_role; }
			if ( ManagedFunction.allowed_roles.includes( as_role ) ) { return as_role; }
			return '';
		};


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


		//---------------------------------------------------------------------
		function _ValidateUser( User )
		{
			if ( LIB_UTILS.value_missing_null_empty( User ) ) { return `Missing parameter: User`; }
			if ( LIB_UTILS.value_missing_null_empty( User.user_id ) ) { return `Missing Parameter: User.user_id`; }
			if ( LIB_UTILS.value_missing_null_empty( User.user_role ) ) { return `Missing Parameter: User.user_role`; }
			return '';
		}


		//=====================================================================
		// ListAll
		//=====================================================================


		managed_storage.ListAll =
			async function ListAll( User )
			{
				let interface_function = StorageConfiguration.interface.ListAll;
				let api_response =
				{
					ok: true,
					origin: `ManagedStorage.${interface_function.name}`,
					as_role: '',
					objects: [],
				};

				//---------------------------------------------------------------------
				// Validate inputs.
				api_response.error = _ValidateUser( User );
				if ( api_response.error !== '' )
				{
					api_response.ok = false;
					return api_response;
				}

				//---------------------------------------------------------------------
				// Authorize Function.
				api_response.as_role = _AuthorizeFunction( User, interface_function );
				if ( api_response.as_role === '' )
				{
					api_response.ok = false;
					api_response.error = `You do not have authorization to perform this function.`;
					return api_response;
				}

				//---------------------------------------------------------------------
				// Invoke storage provider.
				let api_result = { ok: false, Error: `ManagedStorage.${interface_function.name} is not implemented.` };
				if ( !api_result.ok ) { return api_result; }

				// Return results.
				return api_response;
			};


		//=====================================================================
		// ListMine
		//=====================================================================


		managed_storage.ListMine =
			async function ListMine( User )
			{
				let interface_function = StorageConfiguration.interface.ListMine;
				let api_response =
				{
					ok: true,
					origin: `ManagedStorage.${interface_function.name}`,
					as_role: '',
					objects: [],
				};

				//---------------------------------------------------------------------
				// Validate inputs.
				api_response.error = _ValidateUser( User );
				if ( api_response.error !== '' )
				{
					api_response.ok = false;
					return api_response;
				}

				//---------------------------------------------------------------------
				// Authorize Function.
				api_response.as_role = _AuthorizeFunction( User, interface_function );
				if ( api_response.as_role === '' )
				{
					api_response.ok = false;
					api_response.error = `You do not have authorization to perform this function.`;
					return api_response;
				}

				//---------------------------------------------------------------------
				// Invoke storage provider.
				let api_result = { ok: false, Error: `ManagedStorage.${interface_function.name} is not implemented.` };
				if ( !api_result.ok ) { return api_result; }

				// Return results.
				return api_response;
			};


		//=====================================================================
		// CountAll
		//=====================================================================


		managed_storage.CountAll =
			async function CountAll( User )
			{
				let interface_function = StorageConfiguration.interface.CountAll;
				let api_response =
				{
					ok: true,
					origin: `ManagedStorage.${interface_function.name}`,
					as_role: '',
					objects: [],
				};

				//---------------------------------------------------------------------
				// Validate inputs.
				api_response.error = _ValidateUser( User );
				if ( api_response.error !== '' )
				{
					api_response.ok = false;
					return api_response;
				}

				//---------------------------------------------------------------------
				// Authorize Function.
				api_response.as_role = _AuthorizeFunction( User, interface_function );
				if ( api_response.as_role === '' )
				{
					api_response.ok = false;
					api_response.error = `You do not have authorization to perform this function.`;
					return api_response;
				}

				//---------------------------------------------------------------------
				// Invoke storage provider.
				let api_result = { ok: false, Error: `ManagedStorage.${interface_function.name} is not implemented.` };
				if ( !api_result.ok ) { return api_result; }

				// Return results.
				return api_response;
			};


		//=====================================================================
		// CountMine
		//=====================================================================


		managed_storage.CountMine =
			async function CountMine( User )
			{
				let interface_function = StorageConfiguration.interface.CountMine;
				let api_response =
				{
					ok: true,
					origin: `ManagedStorage.${interface_function.name}`,
					as_role: '',
					objects: [],
				};

				//---------------------------------------------------------------------
				// Validate inputs.
				api_response.error = _ValidateUser( User );
				if ( api_response.error !== '' )
				{
					api_response.ok = false;
					return api_response;
				}

				//---------------------------------------------------------------------
				// Authorize Function.
				api_response.as_role = _AuthorizeFunction( User, interface_function );
				if ( api_response.as_role === '' )
				{
					api_response.ok = false;
					api_response.error = `You do not have authorization to perform this function.`;
					return api_response;
				}

				//---------------------------------------------------------------------
				// Invoke storage provider.
				let api_result = { ok: false, Error: `ManagedStorage.${interface_function.name} is not implemented.` };
				if ( !api_result.ok ) { return api_result; }

				// Return results.
				return api_response;
			};


		//=====================================================================
		// FindOne
		//=====================================================================


		managed_storage.FindOne =
			async function FindOne( User, Criteria )
			{
				let interface_function = StorageConfiguration.interface.FindOne;
				let api_response =
				{
					ok: true,
					origin: `ManagedStorage.${interface_function.name}`,
					as_role: '',
					objects: [],
				};

				//---------------------------------------------------------------------
				// Validate inputs.
				api_response.error = _ValidateUser( User );
				if ( api_response.error !== '' )
				{
					api_response.ok = false;
					return api_response;
				}

				//---------------------------------------------------------------------
				// Authorize Function.
				api_response.as_role = _AuthorizeFunction( User, interface_function );
				if ( api_response.as_role === '' )
				{
					api_response.ok = false;
					api_response.error = `You do not have authorization to perform this function.`;
					return api_response;
				}

				//---------------------------------------------------------------------
				// Invoke storage provider.
				let api_result = { ok: false, Error: `ManagedStorage.${interface_function.name} is not implemented.` };
				if ( !api_result.ok ) { return api_result; }

				// Return results.
				return api_response;
			};


		//=====================================================================
		// FindMany
		//=====================================================================


		managed_storage.FindMany =
			async function FindMany( User, Criteria )
			{
				let interface_function = StorageConfiguration.interface.FindMany;
				let api_response =
				{
					ok: true,
					origin: `ManagedStorage.${interface_function.name}`,
					as_role: '',
					objects: [],
				};

				//---------------------------------------------------------------------
				// Validate inputs.
				api_response.error = _ValidateUser( User );
				if ( api_response.error !== '' )
				{
					api_response.ok = false;
					return api_response;
				}

				//---------------------------------------------------------------------
				// Authorize Function.
				api_response.as_role = _AuthorizeFunction( User, interface_function );
				if ( api_response.as_role === '' )
				{
					api_response.ok = false;
					api_response.error = `You do not have authorization to perform this function.`;
					return api_response;
				}

				//---------------------------------------------------------------------
				// Invoke storage provider.
				let api_result = { ok: false, Error: `ManagedStorage.${interface_function.name} is not implemented.` };
				if ( !api_result.ok ) { return api_result; }

				// Return results.
				return api_response;
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


		return managed_storage;
	};




