import { jest, describe, test, expect, beforeEach } from '@jest/globals'

import v1CommsMessage from '../../../../../mocks/comms-message/v1.js'
import v2CommsMessage from '../../../../../mocks/data-ingest/v1CommsMessage.js'

import { UnprocessableMessageError } from '../../../../../../src/errors/message-errors.js'

const mockLoggerInfo = jest.fn()
const mockLoggerError = jest.fn()
const mockPersistCommsNotification = jest.fn()

jest.unstable_mockModule('../../../../../../src/logging/logger.js', () => ({
  createLogger: () => ({
    info: (...args) => mockLoggerInfo(...args),
    error: (...args) => mockLoggerError(...args)
  })
}))

jest.unstable_mockModule('../../../../../../src/repos/comms-notification.js', () => ({
  persistCommsNotification: mockPersistCommsNotification
}))

const {
  processV1CommsData,
  processV2CommsData
} = await import('../../../../../../src/messaging/inbound/data-ingest/processors/comms')

describe('comms message processor', () => {
  describe('v1 message', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('should process a valid v1 message', async () => {
      await processV1CommsData(v1CommsMessage)

      expect(mockLoggerInfo).toHaveBeenCalledWith('Comms message processed successfully, eventId: a058de5b-42ad-473c-91e7-0797a43fda30')
    })

    test('should call persistCommsNotification with validated message', async () => {
      await processV1CommsData(v1CommsMessage)

      expect(mockPersistCommsNotification).toHaveBeenCalledWith(v1CommsMessage.commsMessage)
      expect(mockLoggerInfo).toHaveBeenCalledWith('Comms message processed successfully, eventId: a058de5b-42ad-473c-91e7-0797a43fda30')
    })

    test('should throw UNPROCESSABLE_MESSAGE error for invalid v1 message', async () => {
      await expect(processV1CommsData({})).rejects.toThrow(UnprocessableMessageError)
      expect(mockLoggerError).toHaveBeenCalledWith('Invalid message: "id" is required,"commsMessage" is required')
      expect(mockPersistCommsNotification).not.toHaveBeenCalled()
    })
  })

  describe('v2 message', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('should process a valid v2 message', async () => {
      await processV2CommsData(v2CommsMessage)

      expect(mockLoggerInfo).toHaveBeenCalledWith('Comms message processed successfully, eventId: a058de5b-42ad-473c-91e7-0797a43fda30')
    })

    test('should call persistCommsNotification with validated message', async () => {
      await processV2CommsData(v2CommsMessage)

      expect(mockPersistCommsNotification).toHaveBeenCalledWith(v2CommsMessage)
      expect(mockLoggerInfo).toHaveBeenCalledWith('Comms message processed successfully, eventId: a058de5b-42ad-473c-91e7-0797a43fda30')
    })

    test('should throw UNPROCESSABLE_MESSAGE error for invalid v2 message', async () => {
      await expect(processV2CommsData({})).rejects.toThrow(UnprocessableMessageError)
      expect(mockLoggerError).toHaveBeenCalledWith('Invalid message: "id" is required,"source" is required,"specversion" is required,"type" is required,"datacontenttype" is required,"time" is required,"data" is required')
      expect(mockPersistCommsNotification).not.toHaveBeenCalled()
    })
  })
})
