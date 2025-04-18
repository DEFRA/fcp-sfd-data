import { config } from '../config/index.js'
import { saveEvent, getByProperty, getById } from './common/index.js'
import { createLogger } from '../logging/logger.js'
import checkIdempotency from './common/check-idempotency.js'

const logger = createLogger()

const notificationsCollection = config.get('mongo.collections.notifications')

const persistCommsNotification = async (notification) => {
  if (await checkIdempotency(notificationsCollection, notification)) {
    return logger.info(`Notification already processed, eventId: ${notification.id}`)
  }

  await saveEvent(notificationsCollection, notification)

  return logger.info(`Comms message processed successfully, eventId: ${notification.id}`)
}

const getCommsEventById = async (id) => {
  try {
    return await getById(notificationsCollection, id)
  } catch (error) {
    throw new Error(`Error while fetching comms notifications: ${error.message}`,
      { cause: error }
    )
  }
}

const getCommsEventByProperty = async (key, value) => {
  try {
    return await getByProperty(notificationsCollection, key, value)
  } catch (error) {
    throw new Error(`Error while fetching comms notifications: ${error.message}`,
      { cause: error })
  }
}

export {
  persistCommsNotification,
  getCommsEventByProperty,
  getCommsEventById
}
