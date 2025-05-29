import { describe, test, expect, beforeEach, afterAll, beforeAll } from 'vitest'

import { config } from '../../../../src/config/index.js'
import db from '../../../../src/data/db.js'
import mockEvent from '../../../mocks/comms-message/v1.js'

import { startServer } from '../../../../src/api/common/helpers/start-server.js'

const notificationsCollection = config.get('mongo.collections.notifications')

const baseUrl = '/api/v1/comms/events/id'

let server

beforeAll(async () => {
  server = await startServer()
})

beforeEach(async () => {
  if (!db.client.topology?.isConnected()) {
    await db.client.connect()
  }
  await db.collection(notificationsCollection).deleteMany({})
})

afterAll(async () => {
  await server.stop()
  await db.client.close()
})

describe('API routes for comms', () => {
  describe('GET /api/v1/comms/events/id/{id}', () => {
    test('Return 200 when document is found with corresponding ID', async () => {
      await db.collection(notificationsCollection).insertOne({
        _id: mockEvent.commsMessage.data.correlationId,
        events: [mockEvent.commsMessage]
      })

      const id = 'a058de5b-42ad-473c-91e7-0797a43fda30'

      const options = {
        method: 'GET',
        url: `${baseUrl}/${id}`,
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toContain('application/json')
      expect(response.payload).toEqual(JSON.stringify({
        data: {
          correlationId: mockEvent.commsMessage.data.correlationId,
          events: [mockEvent.commsMessage]
        }
      }))
    })

    test('Return 404 when document is not found with corresponding ID', async () => {
      const id = 'a058de5b-42ad-473c-91e7-0797a43fda30'

      const options = {
        method: 'GET',
        url: `${baseUrl}/${id}`,
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(404)
      expect(JSON.parse(response.payload)).toMatchObject({
        statusCode: 404,
        error: 'Not Found',
        message: `No document found with id: ${id}`
      })
    })

    test('Return 400 when id is not a valid UUID', async () => {
      const invalidId = 'not-a-valid-uuid'

      const options = {
        method: 'GET',
        url: `${baseUrl}/${invalidId}`,
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response.payload)).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
        message: '"id" must be a valid GUID'
      })
    })

    test('Return 500 when there is a database error', async () => {
      await db.client.close()

      const id = 'a058de5b-42ad-473c-91e7-0797a43fda30'

      const options = {
        method: 'GET',
        url: `${baseUrl}/${id}`,
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(500)
      expect(JSON.parse(response.payload)).toMatchObject({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An internal server error occurred'
      })
    })
  })
})
