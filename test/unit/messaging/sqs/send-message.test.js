import { describe, test, expect, jest, beforeEach } from '@jest/globals'

const mockSend = jest.fn()
const mockSendMessageCommand = jest.fn()
const mockLoggerError = jest.fn()
const mockRandomUUID = jest.fn()

jest.mock('@aws-sdk/client-sqs', () => ({
  SendMessageCommand: mockSendMessageCommand
}))

jest.unstable_mockModule('../../../../src/logging/logger.js', () => ({
  createLogger: () => ({ error: mockLoggerError })
}))

global.crypto = {
  randomUUID: mockRandomUUID
}

describe('send message', () => {
  const mockQueueUrl = 'http://test-queue-url'
  const mockMessage = 'test-message'
  const mockUUID = '123e4567-e89b-12d3-a456-426614174000'
  const mockSqsClient = { send: mockSend }

  beforeEach(() => {
    jest.clearAllMocks()
    mockRandomUUID.mockReturnValue(mockUUID)
  })

  test('should send message with correct parameters', async () => {
    mockSend.mockResolvedValue({})
    const { sendMessage } = await import('../../../../src/messaging/sqs/send-message.js')

    await sendMessage(mockSqsClient, mockQueueUrl, mockMessage)

    expect(mockSendMessageCommand).toHaveBeenCalledWith({
      QueueUrl: mockQueueUrl,
      MessageBody: mockMessage,
      MessageGroupId: mockUUID,
      MessageDeduplicationId: mockUUID
    })
    expect(mockSend).toHaveBeenCalled()
    expect(mockLoggerError).not.toHaveBeenCalled()
  })

  test('should log error when send fails', async () => {
    const mockError = new Error('Send failed')
    mockSend.mockRejectedValue(mockError)
    const { sendMessage } = await import('../../../../src/messaging/sqs/send-message.js')

    await sendMessage(mockSqsClient, mockQueueUrl, mockMessage)

    expect(mockSendMessageCommand).toHaveBeenCalledWith({
      QueueUrl: mockQueueUrl,
      MessageBody: mockMessage,
      MessageGroupId: mockUUID,
      MessageDeduplicationId: mockUUID
    })
    expect(mockSend).toHaveBeenCalled()
    expect(mockLoggerError).toHaveBeenCalledWith(mockError)
  })
})
