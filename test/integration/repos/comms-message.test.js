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
      expect(savedNotification.events[0]).toMatchObject(v1CommsMessage)
    })

    test('should not create a new record when correlationId is the same as an existing document _id', async () => {
      console.log(v1CommsMessage)
      await persistCommsNotification(v1CommsMessage)
      const correlatedV1CommsMessage = { ...v1CommsMessage, id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }
      await persistCommsNotification(correlatedV1CommsMessage)

      const result = await db.collection(notificationsCollection).find({ _id: v1CommsMessage.commsMessage.data.correlationId }).toArray()

      expect(result).toBeDefined()
      expect(result.length).toBe(1)
      expect(result[0].events[0]).toMatchObject(v1CommsMessage)
      expect(result[0].events[1]).toMatchObject(correlatedV1CommsMessage)
    })

    // TODO add test for error handling if correlation id is null
    // TODO add test to check event with different values but same correlation id are saved in the same document
  })
})
