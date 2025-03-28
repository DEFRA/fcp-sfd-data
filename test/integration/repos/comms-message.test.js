import { describe, test, expect, beforeEach } from '@jest/globals'
import { config } from '../../../src/config/index.js'
import { persistCommsNotification } from '../../../src/repos/comms-notification.js'
import db from '../../../src/data/db.js'

import v1CommsMessage from '../../mocks/comms-message/v1.js'

const notificationsCollection = config.get('mongo.collections.notifications')

describe('Persist inbound messages to db', () => {
  beforeEach(async () => {
    await db.collection(notificationsCollection).deleteMany({})
  })

  describe('comms notifications', () => {
    test('should persist a document in the notifications collection', async () => {
      await persistCommsNotification(v1CommsMessage.commsMessage)

      const result = await db.collection(notificationsCollection).find().toArray()
      expect(result).toBeDefined()
      expect(result.length).toBe(1)

      const savedNotification = result[0]
      expect(savedNotification.events[0]).toMatchObject(v1CommsMessage.commsMessage)
    })

    test('should append event to existing document when correlationId matches but other values differ', async () => {
      await persistCommsNotification(v1CommsMessage.commsMessage)

      const modifiedMessage = {
        ...v1CommsMessage,
        id: 'different-id',
        commsMessage: {
          ...v1CommsMessage.commsMessage,
          data: {
            ...v1CommsMessage.commsMessage.data,
            reference: 'different-reference',
            sbi: '999999999'
          }
        }
      }

      await persistCommsNotification(modifiedMessage.commsMessage)

      const result = await db.collection(notificationsCollection)
        .findOne({ _id: v1CommsMessage.commsMessage.data.correlationId })

      expect(result).toBeDefined()
      expect(result.events).toHaveLength(2)
      expect(result.events[0]).toMatchObject(v1CommsMessage.commsMessage)
      expect(result.events[1]).toMatchObject(modifiedMessage.commsMessage)
      expect(result.events[1].data.reference).toBe('different-reference')
      expect(result.events[1].data.sbi).toBe('999999999')
    })

    test('should not create a new document when correlationId is the same as an existing document _id', async () => {
      await persistCommsNotification(v1CommsMessage.commsMessage)
      const correlatedV1CommsMessage = { ...v1CommsMessage, id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }
      await persistCommsNotification(correlatedV1CommsMessage.commsMessage)

      const result = await db.collection(notificationsCollection).find({ _id: v1CommsMessage.commsMessage.data.correlationId }).toArray()

      expect(result).toBeDefined()
      expect(result.length).toBe(1)
      expect(result[0].events[0]).toMatchObject(v1CommsMessage.commsMessage)
      expect(result[0].events[1]).toMatchObject(correlatedV1CommsMessage.commsMessage)
    })

    test('should create new document with correlationId as _id when no match found', async () => {
      const newMessage = {
        ...v1CommsMessage,
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        commsMessage: {
          ...v1CommsMessage.commsMessage,
          data: {
            ...v1CommsMessage.commsMessage.data,
            correlationId: 'a058de5b-42ad-473c-91e7-0797a43fda31'
          }
        }
      }

      await persistCommsNotification(newMessage.commsMessage)

      const result = await db.collection(notificationsCollection)
        .findOne({ _id: newMessage.commsMessage.data.correlationId })

      expect(result).toBeDefined()
      expect(result._id).toBe(newMessage.commsMessage.data.correlationId)
      expect(result.events).toHaveLength(1)
      expect(result.events[0]).toMatchObject(newMessage.commsMessage)
    })

    test('should throw error when correlationId is falsy', async () => {
      const invalidMessage = {
        ...v1CommsMessage,
        commsMessage: {
          ...v1CommsMessage.commsMessage,
          data: {
            ...v1CommsMessage.commsMessage.data,
            correlationId: null
          }
        }
      }

      await expect(persistCommsNotification(invalidMessage.commsMessage))
        .rejects
        .toThrow('Error while persisting comms notification: Correlation ID is required')
    })

    test('should throw error when database connection fails', async () => {
      await db.client.close()

      await expect(persistCommsNotification(v1CommsMessage))
        .rejects
        .toThrow('Error while persisting comms notification')
    })
  })
})
