import { describe, beforeAll, beforeEach, afterAll, test, expect } from '@jest/globals'
import validCommsMessage from '../../../mocks/comms-message/v1.js'
import commsEventByPropertyQuery from '../queries/comms-by-property.js'
import { persistCommsNotification } from '../../../../src/repos/comms-message.js'
import { startServer } from '../../../../src/api/common/helpers/start-server.js'
import db from '../../../../src/data/db.js'

describe('GQL: Submit commsEvent by property query via endpoint', () => {
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

  test('returns all commsEvents with corresponding crn', async () => {
    const secondMessage = {
      ...validCommsMessage.commsMessage,
      id: 'different-id',
      data: {
        ...validCommsMessage.commsMessage.data,
        correlationId: 'test-correlation-id-2'
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
          key: 'CRN',
          value: validCommsMessage.commsMessage.data.crn
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    const result = responseBody.data.getCommsEventByProperty

    expect(responseBody.errors).toBeUndefined()
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)
    expect(result[0].events[0].data.crn).toBe(validCommsMessage.commsMessage.data.crn)
  })

  test('returns a single commsEvent by CRN when multiple records in database', async () => {
    const secondMessage = {
      ...validCommsMessage.commsMessage,
      data: {
        ...validCommsMessage.commsMessage.data,
        crn: '1234567890'
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
          key: 'CRN',
          value: '1050000000'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    const result = responseBody.data.getCommsEventByProperty

    expect(responseBody.errors).toBeUndefined()
    expect(result).toBeDefined()
    expect(result.length).toBe(1)
    expect(result[0].events[0].data.crn).toBe('1050000000')
  })

  test('returns empty array when no matching records in database', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'CRN',
          value: '1234567890'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toBe('Error while fetching comms notifications: No matching document found')
  })

  test('should return all records when querying on a property not nested within data property', async () => {
    const secondMessage = {
      ...validCommsMessage.commsMessage,
      id: 'b058de5b-42ad-473c-91e7-0797a43fda31',
      data: {
        ...validCommsMessage.commsMessage.data,
        correlationId: 'b058de5b-42ad-473c-91e7-0797a43fda31',
        crn: '1050000001'
      }
    }

    const thirdMessage = {
      ...validCommsMessage.commsMessage,
      id: 'c058de5b-42ad-473c-91e7-0797a43fda32',
      data: {
        ...validCommsMessage.commsMessage.data,
        correlationId: 'c058de5b-42ad-473c-91e7-0797a43fda32',
        crn: '1050000002'
      }
    }

    await persistCommsNotification(secondMessage)
    await persistCommsNotification(thirdMessage)

    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...commsEventByPropertyQuery,
        variables: {
          key: 'TYPE',
          value: 'uk.gov.fcp.sfd.notification.request'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    const result = responseBody.data.getCommsEventByProperty

    expect(responseBody.errors).toBeUndefined()
    expect(result).toBeDefined()
    expect(result.length).toBe(3)
    expect(result[0].events[0].data.crn).toBe('1050000000')
    expect(result[1].events[0].data.crn).toBe('1050000001')
    expect(result[2].events[0].data.crn).toBe('1050000002')
  })

  describe('GQL: Query commsEvents using reference as property', () => {
    test('returns all records with same REFERENCE when CRNs are different', async () => {
      const secondMessage = {
        ...validCommsMessage.commsMessage,
        id: 'different-id',
        data: {
          ...validCommsMessage.commsMessage.data,
          correlationId: 'b058de5b-42ad-473c-91e7-0797a43fda31',
          crn: '1050000001'
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
            key: 'REFERENCE',
            value: 'ffc-ahwr-example-reference'
          }
        })
      }
      const response = await server.inject(options)
      const responseBody = JSON.parse(response.result)
      const result = responseBody.data.getCommsEventByProperty

      expect(responseBody.errors).toBeUndefined()
      expect(result).toBeDefined()
      expect(result.length).toBe(2)
      expect(result[0].events[0].data.crn).toBe('1050000000')
      expect(result[1].events[0].data.crn).toBe('1050000001')
    })

    test('fetches commsEvents by single reference', async () => {
      const options = {
        method: 'POST',
        url: '/graphql',
        headers: {
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify({
          ...commsEventByPropertyQuery,
          variables: {
            key: 'REFERENCE',
            value: 'ffc-ahwr-example-reference'
          }
        })
      }
      const response = await server.inject(options)
      const responseBody = JSON.parse(response.result)
      const result = responseBody.data.getCommsEventByProperty

      expect(responseBody.errors).toBeUndefined()
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result[0].events[0].data.reference).toBe('ffc-ahwr-example-reference')
    })

    test('fetches commsEvents by array of references', async () => {
      const options = {
        method: 'POST',
        url: '/graphql',
        headers: {
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify({
          ...commsEventByPropertyQuery,
          variables: {
            key: 'REFERENCE',
            value: ['ffc-ahwr-example-reference', 'ffc-ahwr-another-example-reference']
          }
        })
      }
      const response = await server.inject(options)
      const responseBody = JSON.parse(response.result)
      const result = responseBody.data.getCommsEventByProperty

      expect(responseBody.errors).toBeUndefined()
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result[0].events[0].data.reference).toBe('ffc-ahwr-example-reference')
    })
  })

  describe('GQL: Query commsEvents using commsAddress as property', () => {
    test('returns commsAddresses as an array when it is an array in the database', async () => {
      const options = {
        method: 'POST',
        url: '/graphql',
        headers: {
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify({
          ...commsEventByPropertyQuery,
          variables: {
            key: 'CRN',
            value: '1050000000'
          }
        })
      }
      const response = await server.inject(options)
      const responseBody = JSON.parse(response.result)
      const result = responseBody.data.getCommsEventByProperty

      expect(responseBody.errors).toBeUndefined()
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result[0].events[0].data.crn).toBe('1050000000')
      expect(result[0].events[0].data.commsAddresses).toStrictEqual(['jane.doe@defra.gov.uk', 'john.doe@defra.gov.uk'])
    })

    test('returns mixed commsAddresses types correctly', async () => {
      const secondMessage = {
        ...validCommsMessage.commsMessage,
        id: 'different-id',
        data: {
          ...validCommsMessage.commsMessage.data,
          crn: '1050000001',
          commsAddresses: ['john.doe@defra.gov.uk']
        }
      }
      await persistCommsNotification(secondMessage)

      const thirdMessage = {
        ...validCommsMessage.commsMessage,
        id: 'different-id-1',
        data: {
          ...validCommsMessage.commsMessage.data,
          crn: '1050000002',
          commsAddresses: 'jane.doe@defra.gov.uk'
        }
      }
      await persistCommsNotification(thirdMessage)

      const fourthMessage = {
        ...validCommsMessage.commsMessage,
        id: 'different-id-2',
        data: {
          ...validCommsMessage.commsMessage.data,
          correlationId: 'd058de5b-42ad-473c-91e7-0797a43fda33',
          crn: '1050000003',
          commsAddresses: ['test@example.com']
        }
      }
      await persistCommsNotification(fourthMessage)

      const options = {
        method: 'POST',
        url: '/graphql',
        headers: {
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify({
          ...commsEventByPropertyQuery,
          variables: {
            key: 'CRN',
            value: ['1050000000', '1050000003']
          }
        })
      }
      const response = await server.inject(options)
      const responseBody = JSON.parse(response.result)
      const result = responseBody.data.getCommsEventByProperty

      expect(responseBody.errors).toBeUndefined()
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)

      expect(result[0].events[0].data.crn).toBe('1050000000')
      expect(result[0].events[0].data.commsAddresses).toStrictEqual(['jane.doe@defra.gov.uk', 'john.doe@defra.gov.uk'])
      expect(result[0].events[1].data.crn).toBe('1050000001')
      expect(result[0].events[1].data.commsAddresses).toStrictEqual(['john.doe@defra.gov.uk'])
      expect(result[0].events[2].data.crn).toBe('1050000002')
      expect(result[0].events[2].data.commsAddresses).toStrictEqual('jane.doe@defra.gov.uk')

      expect(result[1].events[0].data.crn).toBe('1050000003')
      expect(result[1].events[0].data.commsAddresses).toStrictEqual(['test@example.com'])
    })
  })

  describe('GQL: Endpoint errors for commsEvent queries', () => {
    test('throws error for unsupported value type (object)', async () => {
      const options = {
        method: 'POST',
        url: '/graphql',
        headers: {
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify({
          ...commsEventByPropertyQuery,
          variables: {
            key: 'REFERENCE',
            value: { reference: 'ffc-ahwr-example-reference' }
          }
        })
      }
      const response = await server.inject(options)
      const responseBody = JSON.parse(response.result)

      expect(responseBody.errors).toBeDefined()
      expect(responseBody.errors[0].message).toContain('Value must be either a string or an array of strings')
    })

    test('throws error for unsupported value type (int)', async () => {
      const options = {
        method: 'POST',
        url: '/graphql',
        headers: {
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify({
          ...commsEventByPropertyQuery,
          variables: {
            key: 'REFERENCE',
            value: 1234567890
          }
        })
      }
      const response = await server.inject(options)
      const responseBody = JSON.parse(response.result)

      expect(responseBody.errors).toBeDefined()
      expect(responseBody.errors[0].message).toContain('Value must be either a string or an array of strings')
    })

    test('throws error for nested array', async () => {
      const options = {
        method: 'POST',
        url: '/graphql',
        headers: {
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify({
          ...commsEventByPropertyQuery,
          variables: {
            key: 'REFERENCE',
            value: ['ffc-ahwr-example-reference', ['ffc-ahwr-another-example-reference']]
          }
        })
      }
      const response = await server.inject(options)
      const responseBody = JSON.parse(response.result)

      expect(responseBody.errors).toBeDefined()
      expect(responseBody.errors[0].message).toContain('Value must be either a string or an array of strings')
    })

    test('throws an error when key is not provided', async () => {
      const options = {
        method: 'POST',
        url: '/graphql',
        headers: {
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify({
          ...commsEventByPropertyQuery,
          variables: {
            value: 'ffc-ahwr-example-reference'
          }
        })
      }
      const response = await server.inject(options)
      const responseBody = JSON.parse(response.result)

      expect(responseBody.errors).toBeDefined()
      expect(responseBody.errors[0].message).toBe('Variable "$key" of required type "commsEnum!" was not provided.')
    })
  })
})
