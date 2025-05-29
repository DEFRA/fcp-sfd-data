import { config } from '../../config/index.js'
import { createLogger } from '../../logging/logger.js'
import { NotFoundError } from '../../errors/not-found-error.js'

import {
  checkIdempotency,
  getByProperty,
  getById,
  saveEvent
} from '../common/index.js'

import getByReference from './get-by-reference.js'

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
    if (error instanceof NotFoundError) {
      throw error
    }
    throw new Error(`Error while fetching comms notifications: ${error.message}`,
      { cause: error })
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

const getCommsEventByReference = async (reference) => {
  try {
    return await getByReference(notificationsCollection, reference)
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error
    }
    throw new Error(`Error while fetching comms notifications: ${error.message}`,
      { cause: error })
  }
}

export {
  persistCommsNotification,
  getCommsEventByProperty,
  getCommsEventById,
  getCommsEventByReference
}
