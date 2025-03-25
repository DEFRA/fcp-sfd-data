import { config } from '../config/index.js'
import saveEvent from './common/save-event.js'

const notificationsCollection = config.get('mongo.collections.notifications')

const persistCommsNotification = async (notification) => {
  try {
    await saveEvent(notificationsCollection, notification)
  } catch (error) {
    throw new Error(`Error while persisting comms notification: ${error.message}`)
  }
}

export {
  persistCommsNotification
}
