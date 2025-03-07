import { describe, test, expect, beforeEach } from '@jest/globals'
import { persistCommsNotification } from '../../../src/interfaces/persist-notifications.js'
import { notifications } from '../../../src/data/index.js'

describe('Persist notifications to db', () => {
  beforeEach(async () => {
    await notifications.deleteMany({})
  })

  test('should persist a notification', async () => {
    await persistCommsNotification({ testKey: 'test-value' })
    const result = await notifications.find().toArray()

    expect(result).toBeDefined()
    expect(result.length).toBe(1)
    expect(result[0].testKey).toBe('test-value')
  })
})
