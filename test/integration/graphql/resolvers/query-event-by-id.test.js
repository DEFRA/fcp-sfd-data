import { describe, beforeAll, beforeEach, afterAll, test, expect } from 'vitest'
import validCommsMessage from '../../../mocks/comms-message/v1.js'
import commsEventByIdQuery from '../queries/comms-by-id.js'
import { persistCommsNotification } from '../../../../src/repos/comms/comms-message.js'
import { startServer } from '../../../../src/api/common/helpers/start-server.js'
import db from '../../../../src/data/db.js'

describe.skip('GQL get by ID', () => {
  let server

  beforeAll(async () => {
    server = await startServer()
  })

  beforeEach(async () => {
    await db.collection('notificationEvents').deleteMany({})
    await persistCommsNotification(validCommsMessage.commsMessage)
  })

  afterAll(async () => {
    await db.collection('notificationEvents').deleteMany({})
    await server.stop()
  })

  test('returns single commsEvent by id', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByIdQuery,
        variables: {
          commsEventByPKId: validCommsMessage.commsMessage.data.correlationId
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    const result = responseBody.data.getCommsEventById

    expect(responseBody.errors).toBeUndefined()
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(false)
    expect(result.correlationId).toBe(validCommsMessage.commsMessage.data.correlationId)
    expect(Array.isArray(result.events)).toBe(true)
    expect(result.events.length).toBeGreaterThan(0)
    expect(result.events[0].data.commsAddresses).toStrictEqual(validCommsMessage.commsMessage.data.commsAddresses)
  })

  test('returns error for null id', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByIdQuery,
        variables: {
          commsEventByPKId: null
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toBe('Variable "$commsEventByPKId" of non-null type "String!" must not be null.')
  })

  test('returns error for missing id', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByIdQuery,
        variables: {}
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toBe('Variable "$commsEventByPKId" of required type "String!" was not provided.')
  })
})
