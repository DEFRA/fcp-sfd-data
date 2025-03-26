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

const getCommsEventById = async (id) => {
  try {
    const notification = await db.collection(notificationsCollection).findOne({ _id: id })

    if (!notification) {
      return []
    }

    return { correlationId: notification._id, events: notification.events }
  } catch (error) {
    throw new Error(`Error while fetching comms notifications: ${error.message}`)
  }
}

const getByProperty = async (key, value) => {
  try {
    const query = { [key]: value }
    const notifications = await db.collection(notificationsCollection).find(query).toArray()
    return notifications.map((notification) => ({ correlationId: notification._id, events: notification.events }))
  } catch (error) {
    throw new Error(`Error while fetching comms notifications: ${error.message}`)
  }
}

export {
  persistCommsNotification,
  getByProperty,
  getCommsEventById
}
