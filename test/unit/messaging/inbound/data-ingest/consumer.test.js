import { jest, describe, test, expect, beforeEach, afterAll } from '@jest/globals'

import * as sqsConsumer from 'sqs-consumer'

const mockLoggerInfo = jest.fn()
const mockLoggerError = jest.fn()

jest.unstable_mockModule('../../../../../src/logging/logger.js', () => ({
  createLogger: () => ({
    info: (...args) => mockLoggerInfo(...args),
    error: (...args) => mockLoggerError(...args)
  })
}))

const mockStart = jest.fn()
const mockStop = jest.fn()

let mockConsumer

const consumerSpy = jest.spyOn(sqsConsumer.Consumer, 'create').mockImplementation((config) => {
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
      jest.clearAllMocks()
    })

    test('should log consumer start', () => {
      mockConsumer.emit('started')

      expect(mockLoggerInfo).toHaveBeenCalledWith('Data ingestion consumer started')
    })

    test('should log consumer stop', () => {
      mockConsumer.emit('stopped')

      expect(mockLoggerInfo).toHaveBeenCalledWith('Data ingestion consumer stopped')
    })

    test('should log consumer error', () => {
      mockConsumer.emit('error', new Error('Consumer error'))

      expect(mockLoggerError).toHaveBeenCalledWith('Error during data ingestion message handling: Consumer error')
    })

    test('should log consumer processing_error', () => {
      mockConsumer.emit('processing_error', new Error('Consumer error'))

      expect(mockLoggerError).toHaveBeenCalledWith('Error during data ingestion message processing: Consumer error')
    })

    test('should log consumer timeout_error', () => {
      mockConsumer.emit('timeout_error', new Error('Consumer error'))

      expect(mockLoggerError).toHaveBeenCalledWith('Timeout error during data ingestion message handling: Consumer error')
    })
  })

  afterAll(() => {
    consumerSpy.mockRestore()
  })
})
