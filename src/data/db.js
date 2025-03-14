import { MongoClient } from 'mongodb'
import { createSecureContext } from '../api/common/helpers/secure-context/index.js'
import { config } from '../config/index.js'

import { createLogger } from '../logging/logger.js'

const logger = createLogger()

const client = await MongoClient.connect(config.get('mongo.urlToHttpOptions'), {
  retryWrites: false,
  readPreference: 'secondary',
  ...(createSecureContext && { secureContext: createSecureContext(logger) })
})

const db = client.db(config.get('mongo.database'))

logger.info('Connected to MongoDB')

export default db
