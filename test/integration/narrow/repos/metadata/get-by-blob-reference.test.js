import { describe, test, expect, beforeEach } from 'vitest'
import getByBlobReference from '../../../../../src/repos/metadata/get-by-blob-reference.js'
import db from '../../../../../src/data/db.js'
import v1Metadata from '../../../../mocks/file-metadata/v1.js'

const mockEvent = { ...v1Metadata.metadata }

const testCollection = 'test'

describe('getByBlobReference Integration Tests', () => {
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

    const result = await getByBlobReference(testCollection, mockEvent.data.blobReference)

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

    const result = await getByBlobReference(testCollection, mockEvent.data.blobReference)

    expect(result).toBeDefined()
    expect(result).toHaveLength(2)
    expect(result[0].events[0]).toMatchObject(firstEvent)
    expect(result[1].events[0]).toMatchObject(secondEvent)
  })

  test('should throw an error when no documents match the query', async () => {
    await expect(getByBlobReference(testCollection, 'non-existent-blob-reference'))
      .rejects
      .toThrow()
  })

  test('should throw an error when database connection fails', async () => {
    await db.client.close()

    await expect(getByBlobReference(testCollection, mockEvent.data.blobReference))
      .rejects
      .toThrow()
  })
  test('should return multiple events in a single document', async () => {
    const firstEvent = {
      ...mockEvent,
      id: 'first-id',
      data: { ...mockEvent.data }
    }

    const secondEvent = {
      ...mockEvent,
      id: 'second-id',
      data: { ...mockEvent.data }
    }

    await db.collection(testCollection).insertOne({
      _id: firstEvent.data.correlationId,
      events: [firstEvent, secondEvent]
    })

    const result = await getByBlobReference(testCollection, mockEvent.data.blobReference)

    expect(result).toBeDefined()
    expect(result).toHaveLength(1)
    expect(result[0].correlationId).toBe(firstEvent.data.correlationId)
    expect(result[0].events).toHaveLength(2)
    expect(result[0].events[0]).toMatchObject(firstEvent)
    expect(result[0].events[1]).toMatchObject(secondEvent)
  })
})
