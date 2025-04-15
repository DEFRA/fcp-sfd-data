import { config } from '../config/index.js'
import { saveEvent, getByProperty, getById } from './common/index.js'
import { createLogger } from '../logging/logger.js'
import { UnprocessableMessageError } from '../errors/message-errors.js'

const logger = createLogger()

const notificationsCollection = config.get('mongo.collections.notifications')

const persistCommsNotification = async (notification) => {
  try {
    await saveEvent(notificationsCollection, notification)
    logger.info(`Comms message processed successfully, eventId: ${notification.id}`)
  } catch (error) {
    if (error instanceof UnprocessableMessageError) {
      throw new UnprocessableMessageError(error)
    }
    throw new Error(`Error while persisting comms notification: ${error.message}`,
      { cause: error })
  }
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
