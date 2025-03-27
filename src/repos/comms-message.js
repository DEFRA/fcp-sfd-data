import { config } from '../config/index.js'
import { GraphQLError } from 'graphql'
import { StatusCodes } from 'http-status-codes'
import { saveEvent, getByProperty } from './common/index.js'

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
      throw new GraphQLError('Notification not found', {
        extensions: { code: StatusCodes.NOT_FOUND }
      })
    }

    return { correlationId: notification._id, events: notification.events }
  } catch (error) {
    throw new Error(`Error while fetching comms notifications: ${error.message}`)
  }
}

const getCommsEventByProperty = async (key, value) => {
  try {
    return getByProperty(notificationsCollection, key, value)
  } catch (error) {
    throw new Error(`Error while fetching comms notifications: ${error.message}`)
  }
}

export {
  persistCommsNotification,
  getCommsEventByProperty,
  getCommsEventById
}
