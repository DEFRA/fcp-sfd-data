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
      await persistFileMetadata(v1FileMetadata.metadata)

      const result = await db.collection(fileMetadataCollection).find().toArray()
      expect(result).toBeDefined()
      expect(result.length).toBe(1)

      const savedFileMetadata = result[0]
      expect(savedFileMetadata.events[0]).toMatchObject(v1FileMetadata.metadata)
    })

    test('should not create a new record when correlationId is the same as an existing document _id', async () => {
      await persistFileMetadata(v1FileMetadata.metadata)
      const correlatedv1FileMetadata = { ...v1FileMetadata, id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }
      await persistFileMetadata(correlatedv1FileMetadata.metadata)

      const result = await db.collection(fileMetadataCollection).find({ _id: v1FileMetadata.metadata.data.correlationId }).toArray()

      expect(result).toBeDefined()
      expect(result.length).toBe(1)
      expect(result[0].events[0]).toMatchObject(v1FileMetadata.metadata)
      expect(result[0].events[1]).toMatchObject(correlatedv1FileMetadata.metadata)
    })

    test('should save seperate events witht the same correlationId into the same document', async () => {
      const eventOne = { ...v1FileMetadata }
      const eventTwo = { ...v1FileMetadata }
      eventTwo.metadata.data.sbi = '987654321'
      eventTwo.metadata.data.blobReference = 'test-blob-reference'

      await persistFileMetadata(eventOne.metadata)
      await persistFileMetadata(eventTwo.metadata)

      const result = await db.collection(fileMetadataCollection).find({ _id: v1FileMetadata.metadata.data.correlationId }).toArray()

      expect(result).toBeDefined()
      expect(result.length).toBe(1)
      expect(result[0].events[0]).toMatchObject(eventOne.metadata)
      expect(result[0].events[1]).toMatchObject(eventTwo.metadata)
    })

    test('should throw an error when correlationId is falsey', async () => {
      const event = { ...v1FileMetadata }
      event.metadata.data.correlationId = null
      await expect(persistFileMetadata(event)).rejects.toThrowError()
    })
  })
})
