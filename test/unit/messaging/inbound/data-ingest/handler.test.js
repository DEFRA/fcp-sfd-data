import { jest, describe, test, expect, beforeEach } from '@jest/globals'

import { UNPROCESSABLE_MESSAGE } from '../../../../../src/constants/error-types'

import snsSqsMessage from '../../../../mocks/aws/sns-sqs-message'

const mockLoggerInfo = jest.fn()
const mockLoggerError = jest.fn()

jest.unstable_mockModule('../../../../../src/logging/logger.js', () => ({
  createLogger: () => ({
    info: (...args) => mockLoggerInfo(...args),
    error: (...args) => mockLoggerError(...args)
  })
}))

const mockSendMessage = jest.fn()
const mockProcessor = jest.fn()

jest.unstable_mockModule('../../../../../src/messaging/inbound/data-ingest/processors/processor.js', () => ({
  getProcessor: jest.fn(() => mockProcessor)
}))

jest.unstable_mockModule('../../../../../src/messaging/sqs/send-message', () => ({
  sendMessage: mockSendMessage
}))

const { handleIngestionMessages } = await import('../../../../../src/messaging/inbound/data-ingest/handler.js')

describe('data ingest handler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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

    mockProcessor.mockRejectedValueOnce(new Error('Invalid message', {
      cause: UNPROCESSABLE_MESSAGE
    }))

    const completed = await handleIngestionMessages({}, messages)

    expect(mockLoggerInfo).toHaveBeenCalledWith('Moving unprocessable message to dead letter queue')
    expect(mockSendMessage).toHaveBeenCalledWith(
      {},
      'http://sqs.eu-west-2.127.0.0.1:4566/000000000000/fcp_sfd_data_ingest_dlq.fifo',
      snsSqsMessage.Body
    )
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
