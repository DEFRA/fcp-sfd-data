import { describe, test, expect, beforeEach } from '@jest/globals'
import { config } from '../../../src/config/index.js'
import { persistCommsNotification, persistFileMetadata } from '../../../src/interfaces/persist-inbound.js'
import db from '../../../src/data/db.js'

import v1CommsMessage from '../../mocks/comms-message/v1.js'
import v1FileMetadata from '../../mocks/file-metadata/v1.js'

const notificationsCollection = config.get('mongo.collections.notifications')
const fileMetadataCollection = config.get('mongo.collections.fileMetadata')

describe('Persist inbound messages to db', () => {
  beforeEach(async () => {
    await db.collection(notificationsCollection).deleteMany({})
    await db.collection(fileMetadataCollection).deleteMany({})
  })

  describe('comms notifications', () => {
    test('should persist a record in the notifications collection', async () => {
      await persistCommsNotification(v1CommsMessage)

      const result = await db.collection(notificationsCollection).find().toArray()
      expect(result).toBeDefined()
      expect(result.length).toBe(1)

      const savedNotification = result[0]
      expect(savedNotification).toMatchObject(v1CommsMessage)
    })

    test('should throw error when trying to insert duplicate _id', async () => {
      await persistCommsNotification(v1CommsMessage)
      await expect(persistCommsNotification(v1CommsMessage))
        .rejects
        .toThrow('Error while persisting comms notification')
    })
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
      // First insert
      await persistFileMetadata(v1FileMetadata)
      // Try to insert the same document again (same _id)
      await expect(persistFileMetadata(v1FileMetadata))
        .rejects
        .toThrow('Error while persisting file metadata')
    })
  })
})
