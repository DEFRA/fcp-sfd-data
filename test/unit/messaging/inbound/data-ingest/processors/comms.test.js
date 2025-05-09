import { vi, describe, test, expect, beforeEach } from 'vitest'

import { createLogger } from '../../../../../../src/logging/logger'
import { UnprocessableMessageError } from '../../../../../../src/errors/message-errors.js'

import v1CommsMessage from '../../../../../mocks/comms-message/v1.js'
import v2CommsMessage from '../../../../../mocks/data-ingest/v1CommsMessage.js'

vi.mock('../../../../../../src/logging/logger.js', () => ({
  createLogger: vi.fn().mockReturnValue({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  })
}))

const logger = createLogger()

const persistCommsNotification = vi.fn()
vi.mock('../../../../../../src/repos/comms/comms-message.js', () => ({
  persistCommsNotification
}))

const {
  processV1CommsData,
  processV2CommsData
} = await import('../../../../../../src/messaging/inbound/data-ingest/processors/comms')

describe('comms message processor', () => {
  describe('v1 message', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    test('should call persistCommsNotification with validated message', async () => {
      await processV1CommsData(v1CommsMessage)

      expect(persistCommsNotification).toHaveBeenCalledWith(v1CommsMessage.commsMessage)
    })

    test('should throw UNPROCESSABLE_MESSAGE error for invalid v1 message', async () => {
      await expect(processV1CommsData({})).rejects.toThrow(UnprocessableMessageError)
      expect(logger.error).toHaveBeenCalledWith('Invalid message: "id" is required,"commsMessage" is required')
      expect(persistCommsNotification).not.toHaveBeenCalled()
    })
  })

  describe('v2 message', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    test('should call persistCommsNotification with validated message', async () => {
      await processV2CommsData(v2CommsMessage)

      expect(persistCommsNotification).toHaveBeenCalledWith(v2CommsMessage)
    })

    test('should throw UNPROCESSABLE_MESSAGE error for invalid v2 message', async () => {
      await expect(processV2CommsData({})).rejects.toThrow(UnprocessableMessageError)
      expect(logger.error).toHaveBeenCalledWith('Invalid message: "id" is required,"source" is required,"specversion" is required,"type" is required,"datacontenttype" is required,"time" is required,"data" is required')
      expect(persistCommsNotification).not.toHaveBeenCalled()
    })
  })
})
