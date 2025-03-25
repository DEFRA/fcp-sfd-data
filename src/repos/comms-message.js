import { config } from '../config/index.js'
import saveEvent from './common/save-event.js'
import db from '../data/db.js'

const notificationsCollection = config.get('mongo.collections.notifications')

const persistCommsNotification = async (notification) => {
  try {
    await saveEvent(notificationsCollection, notification)
  } catch (error) {
    throw new Error(`Error while persisting comms notification: ${error.message}`)
  }
}

const getAllCommsEvents = async () => {
  // does something
  const notifications = await db.collection(notificationsCollection).find({})
  // returns data in the correct format
  return notifications
}

export {
  persistCommsNotification,
  getAllCommsEvents
}
