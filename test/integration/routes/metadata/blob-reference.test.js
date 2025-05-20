import { describe, test, expect, beforeEach, afterAll, beforeAll } from 'vitest'

import { config } from '../../../../src/config/index.js'
import db from '../../../../src/data/db.js'
import mockEvent from '../../../mocks/file-metadata/v1.js'

import { startServer } from '../../../../src/api/common/helpers/start-server.js'

const metadataCollection = config.get('mongo.collections.fileMetadata')

const baseUrl = '/api/v1/metadata/events/blob-reference'

let server

const makeApiRequest = async (blobReference) => {
  const requestOptions = {
    method: 'GET',
    url: `${baseUrl}/${blobReference}`,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return server.inject(requestOptions)
}

beforeAll(async () => {
  server = await startServer()
})

beforeEach(async () => {
  if (!db.client.topology?.isConnected()) {
    await db.client.connect()
  }
  await db.collection(metadataCollection).deleteMany({})
})

afterAll(async () => {
  await server.stop()
  await db.client.close()
})

describe('GET /api/v1/metadata/events/blob-reference/{blobReference}', () => {
  test('Return 200 when single document is found with corresponding blobReference', async () => {
    await db.collection(metadataCollection).insertOne({
      _id: mockEvent.metadata.data.correlationId,
      events: [mockEvent.metadata]
    })

    const blobReference = mockEvent.metadata.data.blobReference

    const response = await makeApiRequest(blobReference)

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.payload).toEqual(JSON.stringify({
      data: [{
        correlationId: mockEvent.metadata.data.correlationId,
        events: [mockEvent.metadata]
      }]
    }))
  })
  test('Return 200 when multiple documents are found with corresponding blobReference', async () => {
    await db.collection(metadataCollection).insertMany([
      {
        _id: '09237605-f4e5-4201-aee1-7e42a1682ceg',
        events: [mockEvent.metadata]
      },
      {
        _id: mockEvent.metadata.data.correlationId,
        events: [mockEvent.metadata]
      }
    ])

    const blobReference = mockEvent.metadata.data.blobReference

    const response = await makeApiRequest(blobReference)

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.payload).toEqual(JSON.stringify({
      data: [{
        correlationId: '09237605-f4e5-4201-aee1-7e42a1682ceg',
        events: [mockEvent.metadata]
      },
      {
        correlationId: mockEvent.metadata.data.correlationId,
        events: [mockEvent.metadata]
      }]
    }))
  })

  test('Return 404 when no documents are found with corresponding blobReference', async () => {
    const blobReference = 'not-found-blob-reference'

    const response = await makeApiRequest(blobReference)

    expect(response.statusCode).toBe(404)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.payload).toEqual(JSON.stringify({
      statusCode: 404,
      error: 'Not Found',
      message: `No document found for the provided blob reference: ${blobReference}`
    }))
  })
  test('Return 400 when blobReference is not provided', async () => {
    const blobReference = '%invalid-reference'

    const response = await makeApiRequest(blobReference)

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

    const blobReference = 'test-blob-reference'

    const response = await makeApiRequest(blobReference)

    expect(response.statusCode).toBe(500)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.payload).toEqual(JSON.stringify({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred'
    }))
  })
})
