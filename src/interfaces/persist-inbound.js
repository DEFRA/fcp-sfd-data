import { config } from '../config/index.js'
import db from '../data/db-connection.js'

const notificationsCollection = config.get('mongo.collections.notifications')
const fileMetadataCollection = config.get('mongo.collections.fileMetadata')

const persistCommsNotification = async (notification) => {
  try {
    await db.collection(notificationsCollection).insertOne(notification)
  } catch (error) {
    throw new Error(`Error while persisting comms notification: ${error.message}`)
  }
}

const persistFileMetadata = async (metadata) => {
  try {
    await db.collection(fileMetadataCollection).insertOne(metadata)
  } catch (error) {
    throw new Error(`Error while persisting file metadata: ${error.message}`)
  }
}

export {
  persistCommsNotification,
  persistFileMetadata
}
