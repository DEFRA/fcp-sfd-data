import { describe, beforeAll, beforeEach, afterAll, test, expect } from '@jest/globals'
import validMetadataMessage from '../../../mocks/file-metadata/v1.js'
import metadataByPropertyQuery from '../queries/metadata-by-property.js'
import { persistFileMetadata } from '../../../../src/repos/file-metadata.js'
import { startServer } from '../../../../src/api/common/helpers/start-server.js'
import db from '../../../../src/data/db.js'

describe('GQL get by property', () => {
  let server

  beforeAll(async () => {
    server = await startServer()
  })

  beforeEach(async () => {
    await db.collection('fileMetadataEvents').deleteMany({})
    await persistFileMetadata(validMetadataMessage.metadata)
  })

  afterAll(async () => {
    await db.collection('fileMetadataEvents').deleteMany({})
    await server.stop()
  })

  test('returns metadataEvent by correlationId', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...metadataByPropertyQuery,
        variables: {
          key: 'CORRELATION_ID',
          value: validMetadataMessage.metadata.data.correlationId
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    const result = responseBody.data.getFileMetadataByProperty

    expect(responseBody.errors).toBeUndefined()
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0].correlationId).toBe(validMetadataMessage.metadata.data.correlationId)
    expect(result[0].events[0].data.correlationId).toStrictEqual(validMetadataMessage.metadata.data.correlationId)
  })

  test('fetches metadataEvent by single sbi', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...metadataByPropertyQuery,
        variables: {
          key: 'SBI',
          value: '123456789'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    const result = responseBody.data.getFileMetadataByProperty

    expect(responseBody.errors).toBeUndefined()
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0].correlationId).toBe(validMetadataMessage.metadata.data.correlationId)
    expect(result[0].events[0].data.sbi).toStrictEqual('123456789')
  })

  test('fetches metadataEvent by multiple sbi', async () => {
    const secondMessage = {
      ...validMetadataMessage.metadata,
      id: 'different-id',
      data: {
        ...validMetadataMessage.metadata.data,
        correlationId: 'test-correlation-id-2',
        sbi: '999999999'
      }
    }
    await persistFileMetadata(secondMessage)

    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...metadataByPropertyQuery,
        variables: {
          key: 'SBI',
          value: ['123456789', '999999999']
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    const result = responseBody.data.getFileMetadataByProperty

    expect(responseBody.errors).toBeUndefined()
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)
    expect(result[0].events[0].data.sbi).toBe('123456789')
    expect(result[1].events[0].data.sbi).toBe('999999999')
  })

  test('returns error for invalid enum key', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...metadataByPropertyQuery,
        variables: {
          key: 'INVALID_ENUM',
          value: 'someValue'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toContain('Value "INVALID_ENUM" does not exist in "fileMetadataEnum" enum')
  })

  test('returns error for non-existent value', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...metadataByPropertyQuery,
        variables: {
          key: 'CORRELATION_ID',
          value: 'non-existent-id'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toBe('Error while fetching comms notifications: No matching document found')
  })

  test('returns error for unsupported value type', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...metadataByPropertyQuery,
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

  test('fetches metadata with one valid value and one invalid value', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...metadataByPropertyQuery,
        variables: {
          key: 'SBI',
          value: ['123456789', 'INVALID_VALUE']
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    const result = responseBody.data.getFileMetadataByProperty

    expect(responseBody.errors).toBeUndefined()
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(1)
    expect(result[0].events[0].data.sbi).toBe('123456789')
  })

  test('returns error for no matching values', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...metadataByPropertyQuery,
        variables: {
          key: 'SBI',
          value: 'INVALID_VALUE'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toBe('Error while fetching comms notifications: No matching document found')
  })

  test('returns all metadataEvents with same TYPE when correlationIds are different', async () => {
    const secondMessage = {
      ...validMetadataMessage.metadata,
      id: 'different-id',
      data: {
        ...validMetadataMessage.metadata.data,
        correlationId: 'test-correlation-id-2'
      }
    }
    await persistFileMetadata(secondMessage)

    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...metadataByPropertyQuery,
        variables: {
          key: 'TYPE',
          value: 'uk.gov.fcp.sfd.object.av.clean'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    const result = responseBody.data.getFileMetadataByProperty

    expect(responseBody.errors).toBeUndefined()
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)
    expect(result[0].events[0].type).toBe('uk.gov.fcp.sfd.object.av.clean')
    expect(result[1].events[0].type).toBe('uk.gov.fcp.sfd.object.av.clean')
  })

  test('should return all records when querying on a property not nested within data property', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...metadataByPropertyQuery,
        variables: {
          key: 'CORRELATION_ID',
          value: validMetadataMessage.metadata.data.correlationId
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    const result = responseBody.data.getFileMetadataByProperty

    expect(responseBody.errors).toBeUndefined()
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(1)
    expect(result[0].correlationId).toBe(validMetadataMessage.metadata.data.correlationId)
  })

  test('returns mixed data types correctly', async () => {
    const message = {
      ...validMetadataMessage.metadata,
      data: {
        ...validMetadataMessage.metadata.data,
        sbi: '123456789'
      }
    }
    await persistFileMetadata(message)

    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...metadataByPropertyQuery,
        variables: {
          key: 'SBI',
          value: '123456789'
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    const result = responseBody.data.getFileMetadataByProperty

    expect(responseBody.errors).toBeUndefined()
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(1)
    expect(result[0].events[0].data.sbi).toBe('123456789')
  })
})
