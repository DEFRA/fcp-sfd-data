import { describe, test, expect, beforeEach } from '@jest/globals'
import saveEvent from '../../../../../src/repos/common/save-event.js'
import db from '../../../../../src/data/db.js'
import v1FileMetadata from '../../../../mocks/file-metadata/v1.js'

const mockEvent = { ...v1FileMetadata.metadata }

const testCollection = 'test-collection'

describe('saveEvent Integration Tests', () => {
  beforeEach(async () => {
    if (!db.client.topology?.isConnected()) {
      await db.client.connect()
    }
    await db.collection(testCollection).deleteMany({})
  })

  test('should insert a new document when no document exists with the same correlationId', async () => {
    await saveEvent(testCollection, mockEvent)

    const result = await db.collection(testCollection).findOne({ _id: mockEvent.data.correlationId })

    expect(result).toBeDefined()
    expect(result._id).toBe(mockEvent.data.correlationId)
    expect(result.events).toHaveLength(1)
    expect(result.events[0]).toMatchObject(mockEvent)
  })

  test('should append an event to an existing document with the same correlationId', async () => {
    await db.collection(testCollection).insertOne({
      _id: mockEvent.data.correlationId,
      events: [mockEvent]
    })

    const secondEvent = {
      ...mockEvent,
      id: 'different-id',
      data: {
        ...mockEvent.data,
        blobReference: 'different-blob-reference'
      }
    }

    await saveEvent(testCollection, secondEvent)

    const result = await db.collection(testCollection).findOne({ _id: mockEvent.data.correlationId })

    expect(result).toBeDefined()
    expect(result._id).toBe(mockEvent.data.correlationId)
    expect(result.events).toHaveLength(2)
    expect(result.events[0]).toMatchObject(mockEvent)
    expect(result.events[1]).toMatchObject(secondEvent)
  })

  test('should throw an error when correlationId is missing', async () => {
    const invalidEvent = { ...mockEvent, data: { ...mockEvent.data, correlationId: null } }

    await expect(saveEvent(testCollection, invalidEvent))
      .rejects
      .toThrow('Correlation ID is required')
  })

  test('should create a new document when correlationId is unique', async () => {
    const firstEvent = { ...mockEvent }
    const secondEvent = {
      ...mockEvent,
      id: 'different-id',
      data: {
        ...mockEvent.data,
        correlationId: 'new-correlation-id',
        blobReference: 'new-blob-reference'
      }
    }

    await saveEvent(testCollection, firstEvent)
    await saveEvent(testCollection, secondEvent)

    const result = await db.collection(testCollection).find().toArray()

    expect(result).toHaveLength(2)
    expect(result[0]._id).toBe(firstEvent.data.correlationId)
    expect(result[1]._id).toBe(secondEvent.data.correlationId)
  })

  test('should throw an error when database connection fails', async () => {
    await db.client.close()

    await expect(saveEvent(testCollection, mockEvent))
      .rejects
      .toThrow()
  })

  test('should not save a duplicate document when document id already exists in collection', async () => {
    try {
      await saveEvent(testCollection, mockEvent)
      await saveEvent(testCollection, mockEvent)
    } catch (err) {
      const result = await db.collection(testCollection).find().toArray()
      expect(result[0].events).toHaveLength(1)
      expect(err.message).toBe('Idempotency check failed, event not saved 09237605-f4e5-4201-aee1-7e42a1682cef')
    }
  })

  test('should not save a duplicate document when document id already exists in collection with seperate correlation ids', async () => {
    const secondEvent = {
      ...mockEvent,
      data: {
        correlationId: 'different-correlation-id'
      }
    }

    try {
      await saveEvent(testCollection, mockEvent)
      await saveEvent(testCollection, secondEvent)
    } catch (err) {
      const result = await db.collection(testCollection).find().toArray()
      expect(result[0].events).toHaveLength(1)
      expect(err.message).toBe('Idempotency check failed, event not saved 09237605-f4e5-4201-aee1-7e42a1682cef')
    }
  })
})
