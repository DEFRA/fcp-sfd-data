import { config } from '../config/index.js'
import db from '../data/db.js'

const notificationsCollection = config.get('mongo.collections.notifications')

const persistCommsNotification = async (notification) => {
  try {
    const correlationId = notification.commsMessage.data.correlationId
    if (!correlationId) {
      throw new Error('correlationId is required')
    }

    await db.collection(notificationsCollection).updateOne(
      { _id: correlationId },
      { $push: { events: notification } },
      { upsert: true }
    )
  } catch (error) {
    throw new Error(`Error while persisting comms notification: ${error.message}`)
  }
}

export {
  persistCommsNotification
}
