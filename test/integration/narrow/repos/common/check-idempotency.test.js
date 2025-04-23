import { describe, test, expect, beforeEach, afterAll } from 'vitest'
import db from '../../../../../src/data/db.js'
import checkIdempotency from '../../../../../src/repos/common/check-idempotency.js'
import v1FileMetadata from '../../../../mocks/file-metadata/v1.js'

const mockEvent = { ...v1FileMetadata.metadata }

const testCollection = 'test-collection'

beforeEach(async () => {
  if (!db.client.topology?.isConnected()) {
    await db.client.connect()
  }
  await db.collection(testCollection).deleteMany({})
})

afterAll(async () => {
  await db.client.close()
})

describe('check-idempotency integration tests', () => {
  test('should return false when event does not exist', async () => {
    const result = await checkIdempotency(testCollection, mockEvent)
    expect(result).toBe(false)
  })

  test('should return true when event already exists', async () => {
    await db.collection(testCollection).insertOne({
      _id: mockEvent.data.correlationId,
      events: [mockEvent]
    })

    const result = await checkIdempotency(testCollection, mockEvent)
    expect(result).toBe(true)
  })

  test('should handle multiple events in a document', async () => {
    await db.collection(testCollection).insertOne({
      _id: mockEvent.data.correlationId,
      events: [
        { id: 'other-event', source: 'test-source' },
        mockEvent,
        { id: 'another-event', source: 'different-source' }
      ]
    })

    const result = await checkIdempotency(testCollection, mockEvent)
    expect(result).toBe(true)
  })

  test('should match both event id and source', async () => {
    await db.collection(testCollection).insertOne({
      _id: mockEvent.data.correlationId,
      events: [{
        id: mockEvent.id,
        source: 'different-source'
      }]
    })

    const result = await checkIdempotency(testCollection, mockEvent)
    expect(result).toBe(false)
  })

  test('should throw error when database operation fails', async () => {
    await expect(
      checkIdempotency('', mockEvent)
    ).rejects.toThrow('Error checking idempotency token')
  })
})
