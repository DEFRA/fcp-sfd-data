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
  try {
    const notifications = await db.collection(notificationsCollection).find({}).toArray()
    return notifications
  } catch (error) {
    throw new Error(`Error while fetching comms notifications: ${error.message}`)
  }
}

const getCommsEventById = async (id) => {
  try {
    const notification = await db.collection(notificationsCollection).findOne({ _id: id })
    return notification
  } catch (error) {
    throw new Error(`Error retrieving comms notification by ID: ${error.message}`)
  }
}

export {
  persistCommsNotification,
  getAllCommsEvents,
  getCommsEventById
}
