import { jest, describe, test, expect } from '@jest/globals'

import { sqsClient } from '../../../../src/messaging/sqs/client.js'

const mockStartIngestion = jest.fn()
const mockStopIngestion = jest.fn()

jest.unstable_mockModule('../../../../src/messaging/inbound/data-ingest/consumer.js', () => ({
  startIngestion: mockStartIngestion,
  stopIngestion: mockStopIngestion
}))

const { startMessaging, stopMessaging } = await import('../../../../src/messaging/inbound/inbound.js')

describe('inbound messaging setup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should start message consumers', () => {
    startMessaging()

    expect(mockStartIngestion).toHaveBeenCalledWith(sqsClient)
  })

  test('should stop message consumers', () => {
    stopMessaging()

    expect(mockStopIngestion).toHaveBeenCalled()
  })
})