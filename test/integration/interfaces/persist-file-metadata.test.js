import { jest, describe, test, expect, beforeEach } from '@jest/globals'
import { persistFileMetadata } from '../../../src/interfaces/persist-inbound.js'
import { fileMetadataCollection, notificationsCollection } from '../../../src/data/index.js'

import v1FileMetadata from '../../mocks/file-metadata/v1.js'

describe('Persist notifications to db', () => {
  beforeEach(async () => {
    await notificationsCollection.deleteMany({})
    await fileMetadataCollection.deleteMany({})
  })

  test('should persist a record in the fileMetadata collection', async () => {
    await persistFileMetadata(v1FileMetadata)
    const result = await fileMetadataCollection.find().toArray()

    expect(result).toBeDefined()
    expect(result.length).toBe(1)
    expect(result[0]).toEqual(v1FileMetadata)
  })

  test('should throw an error if persisting file metadata fails', async () => {
    jest.spyOn(fileMetadataCollection, 'insertOne').mockImplementation(() => {
      throw new Error('Database error')
    })

    try {
      await persistFileMetadata(v1FileMetadata)
    } catch (error) {
      expect(error.message).toBe('Error while persisting file metadata: Database error')
    }
  })
})
