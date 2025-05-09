import { describe, test, expect, beforeEach } from 'vitest'
import getByReference from '../../../../../src/repos/comms/get-by-reference.js'
import db from '../../../../../src/data/db.js'
import v1CommsMessage from '../../../../mocks/comms-message/v1.js'

const mockEvent = { ...v1CommsMessage.commsMessage }

const testCollection = 'test'

describe('getByReference Integration Tests', () => {
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

    const result = await getByReference(testCollection, mockEvent.data.personalisation.reference)

    expect(result).toBeDefined()
    expect(result).toHaveLength(1)
    expect(result[0].correlationId).toBe(mockEvent.data.correlationId)
    expect(result[0].events[0]).toMatchObject(mockEvent)
  })

  test('should return multiple documents matching the query', async () => {
    const firstEvent = {
      ...mockEvent,
      id: 'first-id'
    }

    const secondEvent = {
      ...mockEvent,
      id: 'different-id'
    }

    await db.collection(testCollection).insertMany([
      { _id: 'e7b8c6d4-3f2a-4c5e-8b9f-1a2d3e4f5g6h', events: [firstEvent] },
      { _id: secondEvent.data.correlationId, events: [secondEvent] }
    ])

    const result = await getByReference(testCollection, mockEvent.data.personalisation.reference)

    expect(result).toBeDefined()
    expect(result).toHaveLength(2)
    expect(result[0].events[0]).toMatchObject(firstEvent)
    expect(result[1].events[0]).toMatchObject(secondEvent)
  })

  test('should throw an error when no documents match the query', async () => {
    await expect(getByReference(testCollection, 'non-existent-reference'))
      .rejects
      .toThrow()
  })

  // TODO: add test for this when we've refactored the error handling
  test.todo('should return null when no documents match the query', async () => {
    const result = await getByReference(testCollection, 'non-existent-reference')
    expect(result).toBeNull()
  })

  test('should throw an error when database connection fails', async () => {
    await db.client.close()

    await expect(getByReference(testCollection, mockEvent.data.personalisation.reference))
      .rejects
      .toThrow()
  })

  test('should return multiple events in a single document', async () => {
    const firstEvent = {
      ...mockEvent,
      id: 'first-id',
      data: {
        ...mockEvent.data,
        blobReference: 'blob-reference'
      }
    }

    const secondEvent = {
      ...mockEvent,
      id: 'second-id',
      data: {
        ...mockEvent.data,
        blobReference: 'blob-reference'
      }
    }

    await db.collection(testCollection).insertOne({
      _id: firstEvent.data.correlationId,
      events: [firstEvent, secondEvent]
    })

    const result = await getByReference(testCollection, mockEvent.data.personalisation.reference)

    expect(result).toBeDefined()
    expect(result).toHaveLength(1)
    expect(result[0].correlationId).toBe(firstEvent.data.correlationId)
    expect(result[0].events).toHaveLength(2)
    expect(result[0].events[0]).toMatchObject(firstEvent)
    expect(result[0].events[1]).toMatchObject(secondEvent)
  })
})
