import { describe, test, expect, beforeEach, afterAll } from '@jest/globals'
import { persistFileMetadata } from '../../../src/interfaces/persist-inbound.js'
import { fileMetadataCollection, client } from '../../../src/data/db-connection.js'

import v1FileMetadata from '../../mocks/file-metadata/v1.js'

describe('Persist notifications to db', () => {
  beforeEach(async () => {
    await fileMetadataCollection.deleteMany({})
  })

  afterAll(async () => {
    await client.close()
  })

  test('should persist a record in the fileMetadata collection', async () => {
    await persistFileMetadata(v1FileMetadata)

    const result = await fileMetadataCollection.find().toArray()
    expect(result).toBeDefined()
    expect(result.length).toBe(1)

    const savedFileMetadata = result[0]
    expect(savedFileMetadata).toMatchObject(v1FileMetadata)
  })

  test('should not complete message when database is unavailable', async () => {
    await client.close()

    await expect(persistFileMetadata(v1FileMetadata))
      .rejects
      .toThrow('Error while persisting file metadata')
  })
})
