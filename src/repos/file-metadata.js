import { config } from '../config/index.js'
import { saveEvent, getByProperty } from './common/index.js'

const fileMetadataCollection = config.get('mongo.collections.fileMetadata')

const persistFileMetadata = async (event) => {
  try {
    await saveEvent(fileMetadataCollection, event)
  } catch (error) {
    throw new Error(`Error while persisting file metadata event: ${error.message}`)
  }
}

const getMetadataByProperty = async (key, value) => {
  try {
    console.log('getMetadataByProperty', key, value)
    return getByProperty(fileMetadataCollection, key, value)
  } catch (error) {
    throw new Error(`Error while fetching comms notifications: ${error.message}`)
  }
}

export {
  persistFileMetadata,
  getMetadataByProperty
}
