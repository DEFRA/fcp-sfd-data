import { config } from '../config/index.js'
import db from '../data/db.js'

const notificationsCollection = config.get('mongo.collections.notifications')

const persistCommsNotification = async (notification) => {
  try {
    await db.collection(notificationsCollection).insertOne(notification)
  } catch (error) {
    throw new Error(`Error while persisting comms notification: ${error.message}`)
  }
}

export {
  persistCommsNotification
}
