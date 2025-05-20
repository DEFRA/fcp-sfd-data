import { config } from '../../config/index.js'
import { saveEvent, getByProperty, getById } from '../common/index.js'
import getByBlobReference from './get-by-blob-reference.js'
import { createLogger } from '../../logging/logger.js'
import checkIdempotency from '../common/check-idempotency.js'
import { NotFoundError } from '../../errors/not-found-error.js'

const logger = createLogger()

const fileMetadataCollection = config.get('mongo.collections.fileMetadata')

const persistFileMetadata = async (event) => {
  if (await checkIdempotency(fileMetadataCollection, event)) {
    return logger.info(`File metadata message already processed, eventId: ${event.id}`)
  }
  await saveEvent(fileMetadataCollection, event)
  return logger.info(`File metadata message processed successfully, eventId: ${event.id}`)
}

const getMetadataById = async (id) => {
  try {
    return await getById(fileMetadataCollection, id)
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error
    }
    throw new Error(`Error while fetching metadata notifications: ${error.message}`,
      { cause: error })
  }
}

const getMetadataByProperty = async (key, value) => {
  try {
    return await getByProperty(fileMetadataCollection, key, value)
  } catch (error) {
    throw new Error(`Error while fetching comms notifications: ${error.message}`,
      { cause: error })
  }
}

const getMetadataByBlobReference = async (blobReference) => {
  try {
    return await getByBlobReference(fileMetadataCollection, blobReference)
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error
    }
    throw new Error(`Error while fetching metadata notifications: ${error.message}`,
      { cause: error })
  }
}

export {
  persistFileMetadata,
  getMetadataByProperty,
  getMetadataById,
  getMetadataByBlobReference
}
