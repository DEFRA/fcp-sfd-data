export const mongoConfig = {
  mongo: {
    urlToHttpOptions: {
      doc: 'URI for mongodb',
      format: String,
      default: 'mongodb://127.0.0.1:27017/',
      env: process.env.DOCKER_TEST === 'true' ? 'MONGO_URI_LOCAL' : 'MONGO_URI'
    },
    database: {
      doc: 'database for mongodb',
      format: String,
      default: 'fcp-sfd-data',
      env: 'MONGO_DATABASE'
    }
  }
}
