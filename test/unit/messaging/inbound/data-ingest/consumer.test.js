import { vi, describe, test, expect, beforeEach, afterAll } from 'vitest'

import * as sqsConsumer from 'sqs-consumer'

import { createLogger } from '../../../../../src/logging/logger.js'

vi.mock('../../../../../src/logging/logger.js', () => ({
  createLogger: vi.fn().mockReturnValue({
    info: vi.fn(),
    error: vi.fn()
  })
}))

const mockLogger = createLogger()

const mockStart = vi.fn()
const mockStop = vi.fn()

let mockConsumer

const consumerSpy = vi.spyOn(sqsConsumer.Consumer, 'create').mockImplementation((config) => {
  mockConsumer = new sqsConsumer.Consumer(config)

  mockConsumer.start = mockStart
  mockConsumer.stop = mockStop

  return mockConsumer
})

const { startIngestion, stopIngestion } = await import('../../../../../src/messaging/inbound/data-ingest/consumer.js')

describe('data ingestion sqs consumer', () => {
  test('should start the consumer', () => {
    startIngestion({})

    expect(mockConsumer.start).toHaveBeenCalled()
  })

  test('should stop the consumer', () => {
    stopIngestion({})

    expect(mockConsumer.stop).toHaveBeenCalled()
  })

  describe('event listeners', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    test('should log consumer start', () => {
      mockConsumer.emit('started')

      expect(mockLogger.info).toHaveBeenCalledWith('Data ingestion consumer started')
    })

    test('should log consumer stop', () => {
      mockConsumer.emit('stopped')

      expect(mockLogger.info).toHaveBeenCalledWith('Data ingestion consumer stopped')
    })

    test('should log consumer error', () => {
      mockConsumer.emit('error', new Error('Consumer error'))

      expect(mockLogger.error).toHaveBeenCalledWith('Error during data ingestion message handling: Consumer error')
    })

    test('should log consumer processing_error', () => {
      mockConsumer.emit('processing_error', new Error('Consumer error'))

      expect(mockLogger.error).toHaveBeenCalledWith('Error during data ingestion message processing: Consumer error')
    })

    test('should log consumer timeout_error', () => {
      mockConsumer.emit('timeout_error', new Error('Consumer error'))

      expect(mockLogger.error).toHaveBeenCalledWith('Timeout error during data ingestion message handling: Consumer error')
    })
  })

  afterAll(() => {
    consumerSpy.mockRestore()
  })
})
