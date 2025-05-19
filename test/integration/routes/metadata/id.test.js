import { describe, test, expect, beforeEach, afterAll, beforeAll } from 'vitest'

import { config } from '../../../../src/config/index.js'
import db from '../../../../src/data/db.js'
import mockEvent from '../../../mocks/file-metadata/v1.js'

import { startServer } from '../../../../src/api/common/helpers/start-server.js'

const metadataCollection = config.get('mongo.collections.fileMetadata')

const baseUrl = '/api/v1/metadata/events/id'

let server

const makeApiRequest = async (id) => {
  const requestOptions = {
    method: 'GET',
    url: `${baseUrl}/${id}`,
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

describe('API routes for metadata', () => {
  describe('GET /api/v1/metadata/events/id/{id}', () => {
    test('Return 200 when document is found with corresponding ID', async () => {
      await db.collection(metadataCollection).insertOne({
        _id: mockEvent.metadata.data.correlationId,
        events: [mockEvent.metadata]
      })

      const id = '09237605-f4e5-4201-aee1-7e42a1682cef'

      const response = await makeApiRequest(id)

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('application/json')
      expect(response.payload).toEqual(JSON.stringify({
        data: {
          correlationId: mockEvent.metadata.data.correlationId,
          events: [mockEvent.metadata]
        }
      }))
    })

    test('Return 404 when document is not found with corresponding ID', async () => {
      const id = 'a058de5b-42ad-473c-91e7-0797a43fda30'

      const response = await makeApiRequest(id)

      expect(response.statusCode).toBe(404)
      expect(JSON.parse(response.payload)).toMatchObject({
        statusCode: 404,
        error: 'Not Found',
        message: `No document found with id: ${id}`
      })
    })

    test('Return 400 when id is not a valid UUID', async () => {
      const invalidId = 'not-a-valid-uuid'

      const response = await makeApiRequest(invalidId)

      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response.payload)).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
        message: '"id" must be a valid GUID'
      })
    })

    test('Return 500 when there is a database error', async () => {
      await db.client.close()

      const id = '09237605-f4e5-4201-aee1-7e42a1682cef'

      const response = await makeApiRequest(id)

      expect(response.statusCode).toBe(500)
      expect(JSON.parse(response.payload)).toMatchObject({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An internal server error occurred'
      })
    })
  })
})
