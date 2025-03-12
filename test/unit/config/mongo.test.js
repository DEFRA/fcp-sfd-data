import convict from 'convict'
import { describe, test, expect, beforeAll } from '@jest/globals'

describe('mongoConfig', () => {
  beforeAll(() => {
    process.env.MONGO_URI = 'mongo-uri'
    process.env.MONGO_URI_LOCAL = 'mongo-uri-local'
  })

  test('should use MONGO_URI when DOCKER_TEST is not set', async () => {
    delete process.env.DOCKER_TEST
    const { mongoConfig } = await import('../../../src/config/mongo.js')

    const config = convict(mongoConfig)
    const mongoURI = config.get('mongo.urlToHttpOptions')

    expect(mongoURI).toBe('mongo-uri')
  })

  test('should use MONGO_URI_LOCAL when DOCKER_TEST is set to true', async () => {
    process.env.DOCKER_TEST = 'true'
    const { mongoConfig } = await import('../../../src/config/mongo.js')

    const config = convict(mongoConfig)
    const mongoURI = config.get('mongo.urlToHttpOptions')

    expect(mongoURI).toBe('mongo-uri-local')
  })
})
