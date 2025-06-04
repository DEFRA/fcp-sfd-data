import { describe, test, expect, beforeEach, afterAll, beforeAll } from 'vitest'

import { startServer } from '../../../../../src/api/common/helpers/start-server.js'
import { config } from '../../../../../src/config/index.js'
import db from '../../../../../src/data/db.js'

import { makeApiRequest } from '../../../../helpers/makeApiRequest.js'
import { clearCollection, insertMockEventToDb } from '../../../../helpers/mongo.js'
import mockEvent from '../../../../mocks/file-metadata/v1.js'

const metadataCollection = config.get('mongo.collections.fileMetadata')
const baseUrl = '/api/v1/metadata/events/id'
const MOCK_CORRELATION_ID = mockEvent.metadata.data.correlationId
const MOCK_EVENT = mockEvent.metadata

let server

beforeAll(async () => {
  server = await startServer()
})

beforeEach(async () => {
  if (!db.client.topology?.isConnected()) {
    await db.client.connect()
  }
  await clearCollection(metadataCollection)
})

afterAll(async () => {
  await server.stop()
  await db.client.close()
})

describe('API routes for metadata', () => {
  describe('GET /api/v1/metadata/events/id/{id}', () => {
    test('Return 200 when document is found with corresponding ID', async () => {
      await insertMockEventToDb(metadataCollection, MOCK_CORRELATION_ID, MOCK_EVENT)

      const response = await makeApiRequest(server, baseUrl, MOCK_CORRELATION_ID)

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('application/json')
      expect(response.payload).toEqual(JSON.stringify({
        data: {
          correlationId: MOCK_CORRELATION_ID,
          events: [MOCK_EVENT]
        }
      }))
    })

    test('Return 404 when document is not found with corresponding ID', async () => {
      const nonExistingId = 'a058de5b-42ad-473c-91e7-0797a43fda30'

      const response = await makeApiRequest(server, baseUrl, nonExistingId)

      expect(response.statusCode).toBe(404)
      expect(JSON.parse(response.payload)).toMatchObject({
        statusCode: 404,
        error: 'Not Found',
        message: `No document found with id: ${nonExistingId}`
      })
    })

    test('Return 400 when id is not a valid UUID', async () => {
      const invalidId = 'not-a-valid-uuid'

      const response = await makeApiRequest(server, baseUrl, invalidId)

      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response.payload)).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
        message: '"id" must be a valid GUID'
      })
    })

    test('Return 500 when there is a database error', async () => {
      await db.client.close()

      const response = await makeApiRequest(server, baseUrl, MOCK_CORRELATION_ID)

      expect(response.statusCode).toBe(500)
      expect(JSON.parse(response.payload)).toMatchObject({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An internal server error occurred'
      })
    })
  })
})
