import { config } from '../config/index.js'
import saveEvent from './common/save-event.js'

const fileMetadataCollection = config.get('mongo.collections.fileMetadata')

const persistFileMetadata = async (event) => {
  try {
    await saveEvent(fileMetadataCollection, event)
  } catch (error) {
    throw new Error(`Error while persisting file metadata event: ${error.message}`)
  }
}

export {
  persistFileMetadata
}
