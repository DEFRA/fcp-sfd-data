import { describe, beforeAll, beforeEach, afterAll, test, expect } from '@jest/globals'
import validCommsMessage from '../../../mocks/comms-message/v1.js'
import commsEventByPropertyQuery from '../queries/comms-by-property.js'
import { persistCommsNotification } from '../../../../src/repos/comms-message.js'
import { startServer } from '../../../../src/api/common/helpers/start-server.js'
import db from '../../../../src/data/db.js'

describe('GQL get by property', () => {
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

  test('fetches commsEvent by property and returns expected structure', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'CORRELATION_ID',
          value: validCommsMessage.commsMessage.data.correlationId
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    const result = responseBody.data.getCommsEventByProperty

    expect(responseBody.errors).toBeUndefined()
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0].correlationId).toBe(validCommsMessage.commsMessage.data.correlationId)
    expect(result[0].events[0].data.commsAddresses).toStrictEqual(validCommsMessage.commsMessage.data.commsAddresses)
  })

  test('fetches commsEvent by array property value', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'COMMS_ADDRESSES',
          value: validCommsMessage.commsMessage.data.commsAddresses
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    const result = responseBody.data.getCommsEventByProperty

    expect(responseBody.errors).toBeUndefined()
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0].correlationId).toBe(validCommsMessage.commsMessage.data.correlationId)
  })

  test('returns error for invalid enum key', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'INVALID_ENUM',
          value: 'someValue'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toContain('Value "INVALID_ENUM" does not exist in "commsEnum" enum')
  })

  test('returns error for non-existent value', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'CORRELATION_ID',
          value: 'non-existent-id'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toBe('No matching document found')
  })

  test('returns error for unsupported value type', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'CORRELATION_ID',
          value: { id: 'some-id' }
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toContain('Value must be either a string or an array of strings')
  })

  test('fetches commsEvent by multiple properties', async () => {
    // First create a second test message with different data
    const secondMessage = {
      ...validCommsMessage.commsMessage,
      data: {
        ...validCommsMessage.commsMessage.data,
        correlationId: 'test-correlation-id-2',
        commsAddresses: ['test2@example.com']
      }
    }
    await persistCommsNotification(secondMessage)

    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'COMMS_ADDRESSES',
          value: ['test2@example.com']
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    const result = responseBody.data.getCommsEventByProperty

    expect(responseBody.errors).toBeUndefined()
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(1)
    expect(result[0].correlationId).toBe('test-correlation-id-2')
    expect(result[0].events[0].data.commsAddresses).toStrictEqual(['test2@example.com'])
  })
})
