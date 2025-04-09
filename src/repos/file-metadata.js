import { config } from '../config/index.js'
import { saveEvent, getByProperty, getById } from './common/index.js'

const fileMetadataCollection = config.get('mongo.collections.fileMetadata')

const persistFileMetadata = async (event) => {
  try {
    await saveEvent(fileMetadataCollection, event)
  } catch (error) {
    throw new Error(`Error while persisting file metadata event: ${error.message}`,
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
