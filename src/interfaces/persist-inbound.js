import { notificationsCollection, fileMetadataCollection } from '../data/index.js'

const persistCommsNotification = async (notification) => {
  try {
    await notificationsCollection.insertOne(notification)
  } catch (error) {
    throw new Error(`Error while persisting comms notification: ${error.message}`)
  }
}

const persistFileMetadata = async (metadata) => {
  try {
    await fileMetadataCollection.insertOne(metadata)
  } catch (error) {
    throw new Error(`Error while persisting file metadata: ${error.message}`)
  }
}

export {
  persistCommsNotification,
  persistFileMetadata
}
