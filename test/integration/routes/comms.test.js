import { describe, test, expect, beforeEach, afterAll, beforeAll } from 'vitest'

import { config } from '../../../src/config/index.js'
import db from '../../../src/data/db.js'
import mockEvent from '../../mocks/comms-message/v1.js'

import { startServer } from '../../../src/api/common/helpers/start-server.js'

const notificationsCollection = config.get('mongo.collections.notifications')

const baseUrl = '/api/v1/comms/events'

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
  await db.client.close()
})

describe('API routes for comms', () => {
  test('Return 200 when document is found with corresponding ID', async () => {
    await db.collection(notificationsCollection).insertOne({
      _id: mockEvent.commsMessage.data.correlationId,
      events: [mockEvent.commsMessage]
    })

    const eventId = 'a058de5b-42ad-473c-91e7-0797a43fda30'

    const options = {
      method: 'GET',
      url: `${baseUrl}/${eventId}`, // what is the url format?
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toEqual(JSON.stringify({
      data: {
        correlationId: mockEvent.commsMessage.data.correlationId,
        events: [mockEvent.commsMessage]
      }
    }))
  })

  test('Return 404 when document is not found with corresponding ID', async () => {
    const eventId = 'a058de5b-42ad-473c-91e7-0797a43fda30'

    const options = {
      method: 'GET',
      url: `${baseUrl}/${eventId}`,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
    expect(JSON.parse(response.payload)).toMatchObject({
      statusCode: 404,
      error: 'Not Found',
      message: `Error while fetching comms notifications: No document found with id: ${eventId}`
    })
  })

  test('Return 400 when eventId is not a valid UUID', async () => {
    const invalidEventId = 'not-a-valid-uuid'

    const options = {
      method: 'GET',
      url: `${baseUrl}/${invalidEventId}`,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.payload)).toMatchObject({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid request params input'
    })
  })

  test('Return 500 when there is a database error', async () => {
    await db.client.close()

    const eventId = 'a058de5b-42ad-473c-91e7-0797a43fda30'

    const options = {
      method: 'GET',
      url: `${baseUrl}/${eventId}`,
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
