import convict from 'convict'
import { describe, test, expect, beforeEach } from '@jest/globals'
import { mongoConfig } from '../../../src/config/mongo.js'

describe('mongoConfig', () => {
  beforeEach(() => {
    delete process.env.DOCKER_TEST
    process.env.MONGO_URI = 'mongo-uri'
    process.env.MONGO_URI_LOCAL = 'mongo-uri-local'
  })

  test('should use MONGO_URI_LOCAL when DOCKER_TEST is true', () => {
    process.env.DOCKER_TEST = 'true'
    const config = convict(mongoConfig)
    const mongoURI = config.get('mongo.urlToHttpOptions')
    expect(mongoURI).toBe('mongo-uri-local')
  })
})
