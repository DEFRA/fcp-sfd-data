import { config } from '../config/index.js'
import db from '../data/db.js'

const notificationsCollection = config.get('mongo.collections.notifications')

const persistCommsNotification = async (notification) => {
  try {
    const correlationId = notification.commsMessage.data.correlationId

    const existingDocument = await db.collection(notificationsCollection).findOne({ _id: correlationId })

    if (existingDocument) {
      await db.collection(notificationsCollection).updateOne(
        { _id: correlationId },
        { $push: { events: notification } }
      )
    } else {
      await db.collection(notificationsCollection).insertOne({ _id: correlationId, events: [notification] })
    }

    // if document found append the new notification to the existing document in the events array
    // await db.collection(notificationsCollection).updateOne(
    //   { _id: notification.commsMessage.data.correlationId },
    //   { $push: { events: notification } },
    //   { upsert: true }
    // )
  } catch (error) {
    throw new Error(`Error while persisting comms notification: ${error.message}`)
  }
}

export {
  persistCommsNotification
}
