import { config } from '../config/index.js'
import { saveEvent, getByProperty, getById } from './common/index.js'
import { createLogger } from '../logging/logger.js'
import checkIdempotency from './common/check-idempotency.js'

const logger = createLogger()

const fileMetadataCollection = config.get('mongo.collections.fileMetadata')

const persistFileMetadata = async (event) => {
  if (await checkIdempotency(fileMetadataCollection, event)) {
    return logger.info(`File metadata message already processed, eventId: ${event.id}`)
  }
  await saveEvent(fileMetadataCollection, event)
  return logger.info(`File metadata message processed successfully, eventId: ${event.id}`)
}

const getMetadataByProperty = async (key, value) => {
  try {
    return await getByProperty(fileMetadataCollection, key, value)
  } catch (error) {
    throw new Error(`Error while fetching comms notifications: ${error.message}`,
      { cause: error })
  }
}

const getMetadataById = async (id) => {
  try {
    return await getById(fileMetadataCollection, id)
  } catch (error) {
    throw new Error(`Error while fetching comms notifications: ${error.message}`,
      { cause: error })
  }
}

export {
  persistFileMetadata,
  getMetadataByProperty,
  getMetadataById
}
