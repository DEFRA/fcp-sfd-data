import { vi, describe, test, expect, beforeEach } from 'vitest'

import snsSqsMessage from '../../../../mocks/aws/sns-sqs-message'

import { UnprocessableMessageError } from '../../../../../src/errors/message-errors.js'
import { handleIngestionMessages } from '../../../../../src/messaging/inbound/data-ingest/handler.js'

const mockLoggerInfo = vi.fn()
const mockLoggerError = vi.fn()

vi.mock('../../../../../src/logging/logger.js', () => ({
  createLogger: () => ({
    info: (...args) => mockLoggerInfo(...args),
    error: (...args) => mockLoggerError(...args)
  })
}))

const mockProcessor = vi.fn()

vi.mock('../../../../../src/messaging/inbound/data-ingest/processors/processor.js', () => ({
  getProcessor: vi.fn(() => mockProcessor)
}))

vi.mock('../../../../../src/messaging/sqs/send-message.js', () => ({
  sendMessage: vi.fn()
}))

describe('data ingest handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should return completed messages', async () => {
    const messages = [
      snsSqsMessage
    ]

    const completed = await handleIngestionMessages({}, messages)

    expect(completed).toHaveLength(1)
    expect(completed).toContain(snsSqsMessage)
  })

  test('should dead letter messages that throw unprocessable message', async () => {
    const messages = [
      snsSqsMessage
    ]

    mockProcessor.mockRejectedValueOnce(new UnprocessableMessageError('Invalid message'))

    const completed = await handleIngestionMessages({}, messages)

    expect(mockLoggerInfo).toHaveBeenCalledWith('Moving unprocessable message to dead letter queue')
    expect(completed).toHaveLength(1)
  })

  test('should abandon message if exception is not unprocessable message', async () => {
    const messages = [
      snsSqsMessage
    ]

    mockProcessor.mockRejectedValueOnce(new Error('Error connecting to database'))

    const completed = await handleIngestionMessages({}, messages)

    expect(completed).toHaveLength(0)
  })

  test('should still return completed messages if failures in batch', async () => {
    const messages = [
      snsSqsMessage,
      snsSqsMessage,
      snsSqsMessage
    ]

    mockProcessor.mockRejectedValueOnce(new Error('Error connecting to database'))

    const completed = await handleIngestionMessages({}, messages)

    expect(completed).toHaveLength(2)
  })
})
