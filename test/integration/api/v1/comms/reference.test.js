import { describe, test, expect, beforeEach, afterAll, beforeAll } from 'vitest'

import { startServer } from '../../../../../src/api/common/helpers/start-server.js'
import { config } from '../../../../../src/config/index.js'
import db from '../../../../../src/data/db.js'

import { makeApiRequest } from '../../../../helpers/makeApiRequest.js'
import { clearCollection, insertMockEventToDb } from '../../../../helpers/mongo.js'
import mockEvent from '../../../../mocks/comms-message/v1.js'

const NOTIFICATIONS_COLLECTION = config.get('mongo.collections.notifications')
const BASE_URL = '/api/v1/comms/events/reference'

const MOCK_CORRELATION_ID = mockEvent.commsMessage.data.correlationId
const ANOTHER_MOCK_CORRELATION_ID = 'another-mock-correlation-id'
const MOCK_EVENT = mockEvent.commsMessage
const MOCK_REFERENCE = mockEvent.commsMessage.data.reference

let server

beforeAll(async () => {
  server = await startServer()
})

beforeEach(async () => {
  if (!db.client.topology?.isConnected()) {
    await db.client.connect()
  }
  await clearCollection(NOTIFICATIONS_COLLECTION)
})

afterAll(async () => {
  await server.stop()
  await db.client.close()
})

describe('GET /api/v1/comms/events/reference/{reference}', () => {
  test('Return 200 when single document is found with corresponding reference', async () => {
    await insertMockEventToDb(NOTIFICATIONS_COLLECTION, MOCK_CORRELATION_ID, MOCK_EVENT)

    const response = await makeApiRequest(server, BASE_URL, MOCK_REFERENCE)

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.payload).toEqual(JSON.stringify({
      data: [{
        correlationId: MOCK_CORRELATION_ID,
        events: [MOCK_EVENT]
      }]
    }))
  })

  test('Return 200 when multiple documents are found with corresponding reference', async () => {
    await insertMockEventToDb(NOTIFICATIONS_COLLECTION, MOCK_CORRELATION_ID, MOCK_EVENT)
    await insertMockEventToDb(NOTIFICATIONS_COLLECTION, ANOTHER_MOCK_CORRELATION_ID, MOCK_EVENT)

    const response = await makeApiRequest(server, BASE_URL, MOCK_REFERENCE)

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

  test('Return 404 when no documents are found with corresponding reference', async () => {
    const nonExistingReference = 'not-found-reference'

    const response = await makeApiRequest(server, BASE_URL, nonExistingReference)

    expect(response.statusCode).toBe(404)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.payload).toEqual(JSON.stringify({
      statusCode: 404,
      error: 'Not Found',
      message: `No document found for the provided reference: ${nonExistingReference}`
    }))
  })

  test('Return 400 when reference is not provided', async () => {
    const invalidReference = '%invalid-reference'

    const response = await makeApiRequest(server, BASE_URL, invalidReference)

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

    const response = await makeApiRequest(server, BASE_URL, MOCK_REFERENCE)

    expect(response.statusCode).toBe(500)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.payload).toEqual(JSON.stringify({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred'
    }))
  })
})
