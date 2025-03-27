import { describe, test, expect, beforeEach } from '@jest/globals'
import getById from '../../../../../src/repos/common/get-by-id.js'
import db from '../../../../../src/data/db.js'
import v1CommsMessage from '../../../../mocks/comms-message/v1.js'

const mockEvent = { ...v1CommsMessage.commsMessage }

const testCollection = 'test'

describe('getByProperty Integration Tests', () => {
  beforeEach(async () => {
    if (!db.client.topology?.isConnected()) {
      await db.client.connect()
    }
    await db.collection(testCollection).deleteMany({})
  })

  test('should return one document matching the query', async () => {
    await db.collection(testCollection).insertOne({
      _id: mockEvent.data.correlationId,
      events: [mockEvent]
    })

    const result = await getById(testCollection, mockEvent.data.correlationId)

    expect(result).toBeDefined()
    expect(result.correlationId).toBe(mockEvent.data.correlationId)
    expect(result.events[0]).toMatchObject(mockEvent)
  })

  test('should throw an error when no documents match the query', async () => {
    await expect(getById(testCollection, 'non-existent-id'))
      .rejects
      .toThrow('No matching document found')
  })

  test('should throw an error when database connection fails', async () => {
    await db.client.close()

    await expect(getById(testCollection, mockEvent.data.sbi))
      .rejects
      .toThrow()
  })

  test('should return multiple events in a single document', async () => {
    const secondEvent = {
      ...mockEvent,
      id: 'different-id',
      data: {
        ...mockEvent.data,
        blobReference: 'different-blob-reference'
      }
    }

    await db.collection(testCollection).insertOne({
      _id: mockEvent.data.correlationId,
      events: [mockEvent, secondEvent]
    })

    const result = await getById(testCollection, mockEvent.data.correlationId)

    expect(result).toBeDefined()
    expect(result.correlationId).toBe(mockEvent.data.correlationId)
    expect(result.events).toHaveLength(2)
    expect(result.events[0]).toMatchObject(mockEvent)
    expect(result.events[1]).toMatchObject(secondEvent)
  })
})
