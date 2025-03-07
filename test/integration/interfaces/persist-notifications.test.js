import { describe, test, expect } from '@jest/globals'
import { persistCommsNotification } from '../../../src/interfaces/persist-notifications.js'
import db from '../../../src/data/index.js'

describe('Persist notifications to db', () => {
  beforeEach(async () => {
    const collection = db.collection('testCollection')
    await collection.deleteMany({})
  })
  test('should persist one record', async () => {
    await persistCommsNotification({ testKey: 'test-value' })
    const collection = db.collection('testCollection')
    const result = await collection.find().toArray()

    expect(result).toBeDefined()
    expect(result.length).toBe(1)
    expect(result[0].testKey).toBe('test-value')
  })
})
