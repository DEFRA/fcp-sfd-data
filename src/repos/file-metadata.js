import { config } from '../config/index.js'
import db from '../data/db.js'

const fileMetadataCollection = config.get('mongo.collections.fileMetadata')

const persistFileMetadata = async (metadata) => {
  try {
    await db.collection(fileMetadataCollection).insertOne(metadata)
  } catch (error) {
    throw new Error(`Error while persisting file metadata: ${error.message}`)
  }
}

export {
  persistFileMetadata
}
