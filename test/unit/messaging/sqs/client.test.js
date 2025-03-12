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
    mockGet.mockImplementation((key) => {
      switch (key) {
        case 'aws.sqsEndpoint':
          return 'http://localhost:4566'
        case 'aws.region':
          return 'eu-west-2'
        default:
          return undefined
      }
    })
  })

  test('should create client without credentials when access keys not provided', async () => {
    await import('../../../../src/messaging/sqs/client.js')
    expect(mockSQSClient).toHaveBeenCalledWith({
      endpoint: 'http://localhost:4566',
      region: 'eu-west-2'
    })
  })

  test('should create client with credentials when access keys are provided', async () => {
    mockGet.mockImplementation((key) => {
      switch (key) {
        case 'aws.sqsEndpoint':
          return 'http://localhost:4566'
        case 'aws.region':
          return 'eu-west-2'
        case 'aws.accessKeyId':
          return 'test-access-key'
        case 'aws.secretAccessKey':
          return 'test-secret-key'
        default:
          return undefined
      }
    })

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
})
