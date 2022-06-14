
# Configuration

Setup of the underlying storage and related behaviors are controlled through configuration.

The function `LIB_MANAGED_STORAGE.NewManagedStorage( Configuration )` takes a single optional configuration parameter:
```javascript
let storage_config = {
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
		clear_collection_on_start: false,
	},
};
```
