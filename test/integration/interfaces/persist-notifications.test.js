import { describe, test, expect, beforeEach, afterAll } from '@jest/globals'
import { persistCommsNotification } from '../../../src/interfaces/persist-inbound.js'
import { notificationsCollection, client } from '../../../src/data/db-connection.js'

import v1CommsMessage from '../../mocks/comms-message/v1.js'

describe('Persist notifications to db', () => {
  beforeEach(async () => {
    await notificationsCollection.deleteMany({})
  })

  afterAll(async () => {
    await client.close()
  })

  test('should persist a record in the notifications collection and complete message', async () => {
    await persistCommsNotification(v1CommsMessage)

    const result = await notificationsCollection.find().toArray()
    expect(result).toBeDefined()
    expect(result.length).toBe(1)

    const savedNotification = result[0]
    expect(savedNotification).toMatchObject(v1CommsMessage)
  })

  test('should not complete message when database is unavailable', async () => {
    await client.close()

    await expect(persistCommsNotification(v1CommsMessage))
      .rejects
      .toThrow('Error while persisting comms notification')
  })
})
