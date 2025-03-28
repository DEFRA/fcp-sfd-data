import { config } from '../config/index.js'
import { saveEvent, getByProperty, getById } from './common/index.js'

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
    return await getById(notificationsCollection, id)
  } catch (error) {
    throw new Error(`Error while fetching comms notifications: ${error.message}`)
  }
}

const getCommsEventByProperty = async (key, value) => {
  try {
    return await getByProperty(notificationsCollection, key, value)
  } catch (error) {
    throw new Error(`Error while fetching comms notifications: ${error.message}`)
  }
}

export {
  persistCommsNotification,
  getCommsEventByProperty,
  getCommsEventById
}
