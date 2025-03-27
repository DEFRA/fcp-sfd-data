import { describe, test, expect, beforeEach } from '@jest/globals'
import getByProperty from '../../../../../src/repos/common/get-by-property.js'
import db from '../../../../../src/data/db.js'
import v1FileMetadata from '../../../../mocks/file-metadata/v1.js'

const mockEvent = { ...v1FileMetadata.metadata }

const testCollection = 'test-collection'

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

    const result = await getByProperty(testCollection, 'events.data.sbi', mockEvent.data.sbi)

    expect(result).toBeDefined()
    expect(result).toHaveLength(1)
    expect(result[0].correlationId).toBe(mockEvent.data.correlationId)
    expect(result[0].events[0]).toMatchObject(mockEvent)
  })

  test('should return multiple documents matching the query', async () => {
    const secondMetadata = {
      ...mockEvent,
      id: 'different-id',
      data: {
        ...mockEvent.data,
        blobReference: 'different-blob-reference'
      }
    }

    await db.collection(testCollection).insertMany([
      { _id: 'e7b8c6d4-3f2a-4c5e-8b9f-1a2d3e4f5g6h', events: [mockEvent] },
      { _id: secondMetadata.data.correlationId, events: [secondMetadata] }
    ])

    const result = await getByProperty(testCollection, 'events.data.sbi', mockEvent.data.sbi)

    expect(result).toBeDefined()
    expect(result).toHaveLength(2)
    expect(result[0].events[0]).toMatchObject(mockEvent)
    expect(result[1].events[0]).toMatchObject(secondMetadata)
  })

  test('should throw an error when no documents match the query', async () => {
    await expect(getByProperty(testCollection, 'events.data.sbi', 'non-existent-sbi'))
      .rejects
      .toThrow('No matching document found')
  })

  test('should throw an error when database connection fails', async () => {
    await db.client.close()

    await expect(getByProperty(testCollection, 'events.data.sbi', mockEvent.data.sbi))
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

    const result = await getByProperty(testCollection, 'events.data.sbi', mockEvent.data.sbi)

    expect(result).toBeDefined()
    expect(result).toHaveLength(1)
    expect(result[0].correlationId).toBe(mockEvent.data.correlationId)
    expect(result[0].events).toHaveLength(2)
    expect(result[0].events[0]).toMatchObject(mockEvent)
    expect(result[0].events[1]).toMatchObject(secondEvent)
  })
})
