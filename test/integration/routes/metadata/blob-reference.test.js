import { describe, test, expect, beforeEach, afterAll, beforeAll } from 'vitest'

import { startServer } from '../../../../src/api/common/helpers/start-server.js'
import { config } from '../../../../src/config/index.js'
import db from '../../../../src/data/db.js'

import { makeApiRequest } from '../../../helpers/makeApiRequest.js'
import { clearCollection, insertMockEventToDb } from '../../../helpers/mongo.js'
import mockEvent from '../../../mocks/file-metadata/v1.js'

const METADATA_COLLECTION = config.get('mongo.collections.fileMetadata')
const BASE_URL = '/api/v1/metadata/events/blob-reference'

const MOCK_CORRELATION_ID = mockEvent.metadata.data.correlationId
const ANOTHER_MOCK_CORRELATION_ID = 'another-mock-correlation-id'
const MOCK_BLOB_REFERENCE = mockEvent.metadata.data.blobReference
const MOCK_EVENT = mockEvent.metadata

let server

beforeAll(async () => {
  server = await startServer()
})

beforeEach(async () => {
  if (!db.client.topology?.isConnected()) {
    await db.client.connect()
  }
  await clearCollection(METADATA_COLLECTION)
})

afterAll(async () => {
  await server.stop()
  await db.client.close()
})

describe('GET /api/v1/metadata/events/blob-reference/{blobReference}', () => {
  test('Return 200 when single document is found with corresponding blobReference', async () => {
    await insertMockEventToDb(METADATA_COLLECTION, MOCK_CORRELATION_ID, MOCK_EVENT)

    const response = await makeApiRequest(server, BASE_URL, MOCK_BLOB_REFERENCE)

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.payload).toEqual(JSON.stringify({
      data: [{
        correlationId: MOCK_CORRELATION_ID,
        events: [MOCK_EVENT]
      }]
    }))
  })
  test('Return 200 when multiple documents are found with corresponding blobReference', async () => {
    await insertMockEventToDb(METADATA_COLLECTION, MOCK_CORRELATION_ID, MOCK_EVENT)
    await insertMockEventToDb(METADATA_COLLECTION, ANOTHER_MOCK_CORRELATION_ID, MOCK_EVENT)

    const response = await makeApiRequest(server, BASE_URL, MOCK_BLOB_REFERENCE)

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.payload).toEqual(JSON.stringify({
      data: [{
        correlationId: MOCK_CORRELATION_ID,
        events: [MOCK_EVENT]
      },
      {
        correlationId: ANOTHER_MOCK_CORRELATION_ID,
        events: [MOCK_EVENT]
      }]
    }))
  })

  test('Return 404 when no documents are found with corresponding blobReference', async () => {
    const nonExistingBlobReference = 'not-found-blob-reference'

    const response = await makeApiRequest(server, BASE_URL, nonExistingBlobReference)

    expect(response.statusCode).toBe(404)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.payload).toEqual(JSON.stringify({
      statusCode: 404,
      error: 'Not Found',
      message: `No document found for the provided blob reference: ${nonExistingBlobReference}`
    }))
  })
  test('Return 400 when blobReference is not provided', async () => {
    const invalidBlobReference = '%invalid-reference'

    const response = await makeApiRequest(server, BASE_URL, invalidBlobReference)

    expect(response.statusCode).toBe(400)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.payload).toEqual(JSON.stringify({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Bad Request'
    }))
  })

  test('Return 500 when there is a database error', async () => {
    await db.client.close()

    const response = await makeApiRequest(server, BASE_URL, MOCK_BLOB_REFERENCE)

    expect(response.statusCode).toBe(500)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.payload).toEqual(JSON.stringify({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred'
    }))
  })
})
