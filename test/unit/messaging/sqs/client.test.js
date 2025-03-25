import { describe, test, expect, jest, beforeEach } from '@jest/globals'

const mockSQSClient = jest.fn()
jest.mock('@aws-sdk/client-sqs', () => ({
  SQSClient: mockSQSClient
}))

const mockGet = jest.fn()
const config = { get: mockGet }

jest.unstable_mockModule('../../../../src/config/index.js', () => ({
  config
}))

describe('sqs client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should create client with correct configuration', async () => {
    const mockConfig = {
      'aws.sqsEndpoint': 'http://localhost:4566',
      'aws.region': 'eu-west-2',
      'aws.accessKeyId': 'test-access-key',
      'aws.secretAccessKey': 'test-secret-key'
    }
    mockGet.mockImplementation(key => mockConfig[key])

    await import('../../../../src/messaging/sqs/client.js')

    expect(mockSQSClient).toHaveBeenCalledWith({
      endpoint: 'http://localhost:4566',
      region: 'eu-west-2',
      credentials: {
        accessKeyId: 'test-access-key',
        secretAccessKey: 'test-secret-key'
      }
    })
  })

  test('should create client without credentials when not provided', async () => {
    const mockConfig = {
      'aws.sqsEndpoint': 'http://localhost:4566',
      'aws.region': 'eu-west-2'
    }
    mockGet.mockImplementation(key => mockConfig[key])

    await import('../../../../src/messaging/sqs/client.js')

    expect(mockSQSClient).toHaveBeenCalledWith({
      endpoint: 'http://localhost:4566',
      region: 'eu-west-2'
    })
  })
})
