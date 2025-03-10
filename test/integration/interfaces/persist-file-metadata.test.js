import { describe, test, expect, beforeEach } from '@jest/globals'
import { persistFileMetadata } from '../../../src/interfaces/persist-inbound.js'
import { fileMetadataCollection, notificationsCollection } from '../../../src/data/index.js'

describe('Persist notifications to db', () => {
  beforeEach(async () => {
    await notificationsCollection.deleteMany({})
    await fileMetadataCollection.deleteMany({})
  })

  test('should persist a record in the fileMetadata collection', async () => {
    await persistFileMetadata({ testKey: 'test-value' })
    const result = await fileMetadataCollection.find().toArray()

    expect(result).toBeDefined()
    expect(result.length).toBe(1)
    expect(result[0].testKey).toBe('test-value')
  })

  test('should not persist a record if it is not an object', async () => {
    try {
      await persistFileMetadata('test-value')
    } catch (error) {
      expect(error.message).toBe('Invalid notification format')
    }
  })
})
