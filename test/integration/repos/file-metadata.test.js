import { describe, test, expect, beforeEach } from '@jest/globals'
import { config } from '../../../src/config/index.js'
import { persistFileMetadata } from '../../../src/repos/file-metadata.js'
import db from '../../../src/data/db.js'

import v1FileMetadata from '../../mocks/file-metadata/v1.js'

const fileMetadataCollection = config.get('mongo.collections.fileMetadata')

describe('Persist inbound messages to db', () => {
  beforeEach(async () => {
    await db.collection(fileMetadataCollection).deleteMany({})
  })

  describe('file metadata', () => {
    test('should persist a record in the fileMetadata collection', async () => {
      await persistFileMetadata(v1FileMetadata)

      const result = await db.collection(fileMetadataCollection).find().toArray()
      expect(result).toBeDefined()
      expect(result.length).toBe(1)

      const savedFileMetadata = result[0]
      expect(savedFileMetadata).toMatchObject(v1FileMetadata)
    })

    test('should throw error when trying to insert duplicate _id', async () => {
      await persistFileMetadata(v1FileMetadata)
      await expect(persistFileMetadata(v1FileMetadata))
        .rejects
        .toThrow('Error while persisting file metadata')
    })
  })
})
