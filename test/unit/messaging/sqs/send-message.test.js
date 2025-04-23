import { describe, test, expect, beforeEach, vi } from 'vitest'

import { createLogger } from '../../../../src/logging/logger.js'

const mockSend = vi.fn()
const mockSendMessageCommand = vi.fn()

vi.mock('@aws-sdk/client-sqs', () => ({
  SendMessageCommand: mockSendMessageCommand
}))

vi.mock('../../../../src/logging/logger.js', () => ({
  createLogger: vi.fn().mockReturnValue({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  })
}))

const logger = createLogger() // move this underneath the logger mock?

const { sendMessage } = await import('../../../../src/messaging/sqs/send-message.js')

describe('send message', () => {
  const mockQueueUrl = 'http://test-queue-url'
  const mockMessage = 'test-message'
  const mockUUID = '123e4567-e89b-12d3-a456-426614174000'
  const mockSqsClient = { send: mockSend }
  const cryptoSpy = vi.spyOn(crypto, 'randomUUID')

  beforeEach(() => {
    vi.clearAllMocks()
    cryptoSpy.mockReturnValue(mockUUID)
  })

  test('should send message with correct parameters', async () => {
    mockSend.mockResolvedValue({})

    await sendMessage(mockSqsClient, mockQueueUrl, mockMessage)

    expect(mockSendMessageCommand).toHaveBeenCalledWith({
      QueueUrl: mockQueueUrl,
      MessageBody: mockMessage,
      MessageGroupId: mockUUID,
      MessageDeduplicationId: mockUUID
    })
    expect(mockSend).toHaveBeenCalled()
    expect(logger.error).not.toHaveBeenCalled()
  })

  test('should log error when send fails', async () => {
    const mockError = new Error('Send failed')
    mockSend.mockRejectedValue(mockError)

    await sendMessage(mockSqsClient, mockQueueUrl, mockMessage)

    expect(mockSendMessageCommand).toHaveBeenCalledWith({
      QueueUrl: mockQueueUrl,
      MessageBody: mockMessage,
      MessageGroupId: mockUUID,
      MessageDeduplicationId: mockUUID
    })
    expect(mockSend).toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalledWith(mockError)
  })
})
