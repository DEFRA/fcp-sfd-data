import { describe, beforeAll, beforeEach, afterAll, test, expect } from '@jest/globals'
import validMetadataMessage from '../../../mocks/file-metadata/v1.js'
import metadataEventByIdQuery from '../queries/metadata-by-id.js'
import { persistFileMetadata } from '../../../../src/repos/file-metadata.js'
import { startServer } from '../../../../src/api/common/helpers/start-server.js'
import db from '../../../../src/data/db.js'

describe('GQL get by ID', () => {
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

  test('returns single metadataEvent by id', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...metadataEventByIdQuery,
        variables: {
          metadataByPKId: validMetadataMessage.metadata.data.correlationId
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)
    const result = responseBody.data.getFileMetadataById

    expect(responseBody.errors).toBeUndefined()
    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(false)
    expect(result.correlationId).toBe(validMetadataMessage.metadata.data.correlationId)
    expect(Array.isArray(result.events)).toBe(true)
    expect(result.events.length).toBeGreaterThan(0)
    expect(result.events[0].data.correlationId).toStrictEqual(validMetadataMessage.metadata.data.correlationId)
  })

  test('returns error for null id', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...metadataEventByIdQuery,
        variables: {
          metadataByPKId: null
        }
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toBe('Variable "$metadataByPKId" of non-null type "String!" must not be null.')
  })

  test('returns error for missing id', async () => {
    const options = {
      method: 'POST',
      url: '/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        ...metadataEventByIdQuery,
        variables: {}
      })
    }
    const response = await server.inject(options)
    const responseBody = JSON.parse(response.result)

    expect(responseBody.errors).toBeDefined()
    expect(responseBody.errors[0].message).toBe('Variable "$metadataByPKId" of required type "String!" was not provided.')
  })
})
