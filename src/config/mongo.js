export const mongoConfig = {
  mongo: {
    urlToHttpOptions: {
      doc: 'URI for mongodb',
      format: String,
      default: 'mongodb://127.0.0.1:27017/',
      env: 'MONGO_URI'
    },
    database: {
      doc: 'database for mongodb',
      format: String,
      default: 'fcp-sfd-data',
      env: 'MONGO_DATABASE'
    },
    collections: {
      notifications: {
        doc: 'notifications collection',
        format: String,
        default: 'notificationEvents'
      },
      fileMetadata: {
        doc: 'fileMetadata collection',
        format: String,
        default: 'fileMetadataEvents'
      }
    }
  }
}
