import { describe, beforeAll, beforeEach, afterAll, test, expect } from '@jest/globals'
import validCommsMessage from '../../../mocks/comms-message/v1.js'
import commsEventByIdQuery from '../queries/comms-by-id.js'
import { persistCommsNotification } from '../../../../src/repos/comms-message.js'
import { startServer } from '../../../../src/api/common/helpers/start-server.js'
import db from '../../../../src/data/db.js'

describe('GQL get by ID', () => {
  let server

  beforeAll(async () => {
    server = await startServer()
  })

  beforeEach(async () => {
    await db.collection('notifications').deleteMany({})
    await persistCommsNotification(validCommsMessage.commsMessage)
  })

  afterAll(async () => {
    await server.stop()
  })

  test('fetches commsEvent by id and returns expected structure', async () => {
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
})
