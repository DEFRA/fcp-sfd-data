import { vi, describe, test, expect, beforeEach } from 'vitest'
import { SQSClient } from '@aws-sdk/client-sqs'
import { config } from '../../../../src/config/index.js'

vi.mock('@aws-sdk/client-sqs', () => ({
  SQSClient: vi.fn()
}))

vi.mock('../../../../src/config/index.js', () => ({
  config: {
    get: vi.fn()
  }
}))

describe('sqs client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  test('should create client with correct configuration', async () => {
    const mockConfig = {
      'aws.sqsEndpoint': 'http://localhost:4566',
      'aws.region': 'eu-west-2',
      'aws.accessKeyId': 'test-access-key',
      'aws.secretAccessKey': 'test-secret-key'
    }
    config.get.mockImplementation(key => mockConfig[key])

    const { sqsClient } = await import('../../../../src/messaging/sqs/client.js')

    expect(SQSClient).toHaveBeenCalledWith({
      endpoint: 'http://localhost:4566',
      region: 'eu-west-2',
      credentials: {
        accessKeyId: 'test-access-key',
        secretAccessKey: 'test-secret-key'
      }
    })
    expect(sqsClient).toBeDefined()
  })

  test('should create client without credentials when not provided', async () => {
    const mockConfig = {
      'aws.sqsEndpoint': 'http://localhost:4566',
      'aws.region': 'eu-west-2'
    }
    config.get.mockImplementation(key => mockConfig[key])

    const { sqsClient } = await import('../../../../src/messaging/sqs/client.js')

    expect(SQSClient).toHaveBeenCalledWith({
      endpoint: 'http://localhost:4566',
      region: 'eu-west-2'
    })
    expect(sqsClient).toBeDefined()
  })
})
