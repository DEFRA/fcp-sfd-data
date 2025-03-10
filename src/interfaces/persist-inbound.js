import { notificationsCollection, fileMetadataCollection } from '../data/index.js'

const persistCommsNotification = async (notification) => {
  if (typeof notification !== 'object') {
    throw new Error('Invalid notification format')
  }
  await notificationsCollection.insertOne(notification)
}

const persistFileMetadata = async (metadata) => {
  if (typeof metadata !== 'object') {
    throw new Error('Invalid notification format')
  }
  await fileMetadataCollection.insertOne(metadata)
}

export {
  persistCommsNotification,
  persistFileMetadata
}
