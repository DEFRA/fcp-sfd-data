import { describe, test, expect, beforeEach, afterAll, beforeAll } from 'vitest'

import db from '../../../src/data/db.js'
import mockEvent from '../../mocks/comms-message/v1.js'

import { startServer } from '../../../src/api/common/helpers/start-server.js'

const testCollection = 'test-collection'
const baseUrl = '/v1/'

let server

beforeAll(async () => {
  server = await startServer()
})

beforeEach(async () => {
  if (!db.client.topology?.isConnected()) {
    await db.client.connect()
  }
  await db.collection(testCollection).deleteMany({})
})

afterAll(async () => {
  await db.client.close()
})

describe('API routes for comms', () => {
  test('Return 200 when document is found with correspoding ID', async () => {
    await db.collection(testCollection).insertOne({
      _id: mockEvent.data.correlationId,
      events: [mockEvent]
    })

    // create new folder for api routes
    // create new file for first route
    // register the route with the server

    const eventId = 'a058de5b-42ad-473c-91e7-0797a43fda30'

    const options = {
      method: 'GET',
      url: `${baseUrl}/comms/events/${eventId}`, // what is the url format?
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })
})
