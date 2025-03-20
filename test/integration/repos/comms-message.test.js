import { describe, test, expect, beforeEach } from '@jest/globals'
import { config } from '../../../src/config/index.js'
import { persistCommsNotification } from '../../../src/repos/comms-message.js'
import db from '../../../src/data/db.js'

import v1CommsMessage from '../../mocks/comms-message/v1.js'

const notificationsCollection = config.get('mongo.collections.notifications')

describe('Persist inbound messages to db', () => {
  beforeEach(async () => {
    await db.collection(notificationsCollection).deleteMany({})
  })

  describe('comms notifications', () => {
    test('should persist a record in the notifications collection', async () => {
      await persistCommsNotification(v1CommsMessage)

      const result = await db.collection(notificationsCollection).find().toArray()
      expect(result).toBeDefined()
      expect(result.length).toBe(1)

      const savedNotification = result[0]
      expect(savedNotification).toMatchObject(v1CommsMessage)
    })

    test('should throw error when trying to insert duplicate _id', async () => {
      await persistCommsNotification(v1CommsMessage)
      await expect(persistCommsNotification(v1CommsMessage))
        .rejects
        .toThrow('Error while persisting comms notification')
    })
  })
})
