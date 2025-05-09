import { describe, test, expect, beforeEach, afterAll, beforeAll } from 'vitest'

import { config } from '../../../src/config/index.js'
import db from '../../../src/data/db.js'
import mockEvent from '../../mocks/comms-message/v1.js'

import { startServer } from '../../../src/api/common/helpers/start-server.js'

const notificationsCollection = config.get('mongo.collections.notifications')

const baseUrl = '/api/v1/comms/events/reference'

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

describe('GET /api/v1/comms/events/reference/{reference}', () => {
  test('Return 200 when single document is found with corresponding reference', async () => {
    await db.collection(notificationsCollection).insertOne({
      _id: mockEvent.commsMessage.data.correlationId,
      events: [mockEvent.commsMessage]
    })

    const reference = mockEvent.commsMessage.data.personalisation.reference

    const options = {
      method: 'GET',
      url: `${baseUrl}/${reference}`,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.payload).toEqual(JSON.stringify({
      data: [{
        correlationId: mockEvent.commsMessage.data.correlationId,
        events: [mockEvent.commsMessage]
      }]
    }))
  })

  test('Return 200 when multiple documents are found with corresponding reference', async () => {
    await db.collection(notificationsCollection).insertMany([
      {
        _id: 'a058de5b-42ad-473c-81e7-0797a43fda31',
        events: [mockEvent.commsMessage]
      },
      {
        _id: mockEvent.commsMessage.data.correlationId,
        events: [mockEvent.commsMessage]
      }
    ])

    const reference = mockEvent.commsMessage.data.personalisation.reference

    const options = {
      method: 'GET',
      url: `${baseUrl}/${reference}`,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.payload).toEqual(JSON.stringify({
      data: [{
        correlationId: 'a058de5b-42ad-473c-81e7-0797a43fda31',
        events: [mockEvent.commsMessage]
      },
      {
        correlationId: mockEvent.commsMessage.data.correlationId,
        events: [mockEvent.commsMessage]
      }]
    }))
  })

  test('Return 404 when no documents are found with corresponding reference', async () => {
    const reference = 'not-found-reference'

    const options = {
      method: 'GET',
      url: `${baseUrl}/${reference}`,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.payload).toEqual(JSON.stringify({
      statusCode: 404,
      error: 'Not Found',
      message: `Error while fetching comms notifications: No document found for the provided reference: ${reference}`
    }))
  })

  test('Return 400 when reference is not provided', async () => {
    const options = {
      method: 'GET',
      url: `${baseUrl}/%invalid-reference`,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await server.inject(options)

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

    const reference = 'test-reference'

    const options = {
      method: 'GET',
      url: `${baseUrl}/${reference}`,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(500)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.payload).toEqual(JSON.stringify({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred'
    }))
  })
})
