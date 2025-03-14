import { MongoClient } from 'mongodb'
// import { secureContext } from '../api/common/helpers/secure-context/index.js'
import { config } from '../config/index.js'

import { createLogger } from '../logging/logger.js'

const logger = createLogger()

const client = await MongoClient.connect(config.get('mongo.urlToHttpOptions'), {
  retryWrites: false,
  readPreference: 'secondary'
  // ...(secureContext && { secureContext }) add this in once service running
})

const db = client.db(config.get('mongo.database'))

logger.info('Connected to MongoDB')

export default db
