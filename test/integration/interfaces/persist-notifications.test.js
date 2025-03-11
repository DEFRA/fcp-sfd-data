import { describe, test, expect, beforeEach, jest } from '@jest/globals'
import { persistCommsNotification } from '../../../src/interfaces/persist-inbound.js'
import { notificationsCollection, fileMetadataCollection } from '../../../src/data/index.js'

import v1CommsMessage from '../../mocks/comms-message/v1.js'

describe('Persist notifications to db', () => {
  beforeEach(async () => {
    await notificationsCollection.deleteMany({})
    await fileMetadataCollection.deleteMany({})
  })

  test('should persist a record in the notifications collection', async () => {
    await persistCommsNotification(v1CommsMessage)
    const result = await notificationsCollection.find().toArray()

    expect(result).toBeDefined()
    expect(result.length).toBe(1)
    expect(result[0]).toEqual(v1CommsMessage)
  })

  test('should throw an error if persisting comms notification fails', async () => {
    jest.spyOn(notificationsCollection, 'insertOne').mockImplementation(() => {
      throw new Error('Database error')
    })

    try {
      await persistCommsNotification(v1CommsMessage)
    } catch (error) {
      expect(error.message).toBe('Error while persisting comms notification: Database error')
    }
  })
})
