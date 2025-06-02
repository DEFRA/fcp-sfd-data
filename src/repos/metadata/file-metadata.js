import { config } from '../../config/index.js'
import { createLogger } from '../../logging/logger.js'
import { NotFoundError } from '../../errors/not-found-error.js'

import {
  checkIdempotency,
  getById,
  saveEvent
} from '../common/index.js'

import getByBlobReference from './get-by-blob-reference.js'

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
  getMetadataById,
  getMetadataByBlobReference
}
