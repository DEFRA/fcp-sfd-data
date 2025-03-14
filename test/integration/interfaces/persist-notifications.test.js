import { describe, test, expect, beforeEach } from '@jest/globals'
import { config } from '../../../src/config/index.js'
import { persistCommsNotification } from '../../../src/interfaces/persist-inbound.js'
import db from '../../../src/data/db-connection.js'

import v1CommsMessage from '../../mocks/comms-message/v1.js'

const notificationsCollection = config.get('mongo.collections.notifications')

describe('Persist notifications to db', () => {
  beforeEach(async () => {
    await db.collection(notificationsCollection).deleteMany({})
  })

  test('should persist a record in the notifications collection and complete message', async () => {
    await persistCommsNotification(v1CommsMessage)

    const result = await db.collection(notificationsCollection).find().toArray()
    expect(result).toBeDefined()
    expect(result.length).toBe(1)

    const savedNotification = result[0]
    expect(savedNotification).toMatchObject(v1CommsMessage)
  })
})
