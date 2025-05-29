import { describe, test, expect, beforeEach } from 'vitest'

import db from '../../../../../src/data/db.js'

import getByBlobReference from '../../../../../src/repos/metadata/get-by-blob-reference.js'

import { clearCollection, insertMockEventToDb } from '../../../../helpers/mongo.js'

import v1Metadata from '../../../../mocks/file-metadata/v1.js'

const TEST_COLLECTION = 'test'

const MOCK_ID = v1Metadata.metadata.data.correlationId
const ANOTHER_MOCK_CORRELATION_ID = 'another-mock-correlation-id'
const MOCK_BLOB_REFERENCE = v1Metadata.metadata.data.blobReference
const MOCK_EVENT = { ...v1Metadata.metadata }

describe('getByBlobReference Integration Tests', () => {
  beforeEach(async () => {
    if (!db.client.topology?.isConnected()) {
      await db.client.connect()
    }
    await clearCollection(TEST_COLLECTION)
  })

  test('should return one document matching the query', async () => {
    await insertMockEventToDb(TEST_COLLECTION, MOCK_ID, MOCK_EVENT)

    const result = await getByBlobReference(TEST_COLLECTION, MOCK_BLOB_REFERENCE)

    expect(result).toBeDefined()
    expect(result).toHaveLength(1)
    expect(result[0].correlationId).toBe(MOCK_ID)
    expect(result[0].events[0]).toMatchObject(MOCK_EVENT)
  })

  test('should return multiple documents matching the query', async () => {
    const firstEvent = {
      ...MOCK_EVENT,
      id: MOCK_ID
    }

    const secondEvent = {
      ...MOCK_EVENT,
      id: ANOTHER_MOCK_CORRELATION_ID
    }

    await insertMockEventToDb(TEST_COLLECTION, MOCK_ID, firstEvent)
    await insertMockEventToDb(TEST_COLLECTION, ANOTHER_MOCK_CORRELATION_ID, secondEvent)

    const result = await getByBlobReference(TEST_COLLECTION, MOCK_BLOB_REFERENCE)

    expect(result).toBeDefined()
    expect(result).toHaveLength(2)
    expect(result[0].events[0]).toMatchObject(firstEvent)
    expect(result[1].events[0]).toMatchObject(secondEvent)
  })

  test('should throw an error when no documents match the query', async () => {
    await expect(getByBlobReference(TEST_COLLECTION, 'non-existent-blob-reference'))
      .rejects
      .toThrow()
  })

  test('should throw an error when database connection fails', async () => {
    await db.client.close()

    await expect(getByBlobReference(TEST_COLLECTION, MOCK_BLOB_REFERENCE))
      .rejects
      .toThrow()
  })

  test('should return multiple events in a single document', async () => {
    const firstEvent = {
      ...MOCK_EVENT,
      id: MOCK_ID,
      data: { ...MOCK_EVENT.data }
    }

    const secondEvent = {
      ...MOCK_EVENT,
      id: ANOTHER_MOCK_CORRELATION_ID,
      data: { ...MOCK_EVENT.data }
    }

    await insertMockEventToDb(TEST_COLLECTION, MOCK_ID, [firstEvent, secondEvent])

    const result = await getByBlobReference(TEST_COLLECTION, MOCK_BLOB_REFERENCE)

    expect(result).toBeDefined()
    expect(result).toHaveLength(1)
    expect(result[0].correlationId).toBe(firstEvent.data.correlationId)
    expect(result[0].events).toHaveLength(2)
    expect(result[0].events[0]).toMatchObject(firstEvent)
    expect(result[0].events[1]).toMatchObject(secondEvent)
  })
})
