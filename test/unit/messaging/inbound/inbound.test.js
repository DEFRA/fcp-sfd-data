import { vi, describe, test, expect, beforeEach } from 'vitest'

import { sqsClient } from '../../../../src/messaging/sqs/client.js'

const startIngestion = vi.fn()
const stopIngestion = vi.fn()

vi.mock('../../../../src/messaging/inbound/data-ingest/consumer.js', () => ({
  startIngestion,
  stopIngestion
}))

const { startMessaging, stopMessaging } = await import('../../../../src/messaging/inbound/inbound.js')

describe('inbound messaging setup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should start message consumers', () => {
    startMessaging()

    expect(startIngestion).toHaveBeenCalledWith(sqsClient)
  })

  test('should stop message consumers', () => {
    stopMessaging()

    expect(stopIngestion).toHaveBeenCalled()
  })
})
