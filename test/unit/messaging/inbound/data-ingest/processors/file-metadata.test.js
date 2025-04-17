import { jest, describe, test, expect, beforeEach } from '@jest/globals'

import v1FileMetadataMessage from '../../../../../mocks/file-metadata/v1.js'
import v2FileMetadataMessage from '../../../../../mocks/data-ingest/v1FileMetadata.js'

import { UnprocessableMessageError } from '../../../../../../src/errors/message-errors.js'

const mockLoggerInfo = jest.fn()
const mockLoggerError = jest.fn()

jest.unstable_mockModule('../../../../../../src/logging/logger.js', () => ({
  createLogger: () => ({
    info: (...args) => mockLoggerInfo(...args),
    error: (...args) => mockLoggerError(...args)
  })
}))

const mockPersistFileMetadata = jest.fn()
jest.unstable_mockModule('../../../../../../src/repos/file-metadata.js', () => ({
  persistFileMetadata: mockPersistFileMetadata
}))

const {
  processV1FileMetadata,
  processV2FileMetadata
} = await import('../../../../../../src/messaging/inbound/data-ingest/processors/file-metadata.js')

describe('file metadata message processor', () => {
  describe('v1 message', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('should call persistFileMetadata for valid v1 message', async () => {
      await processV1FileMetadata(v1FileMetadataMessage)
      expect(mockPersistFileMetadata).toHaveBeenCalledWith(v1FileMetadataMessage.metadata)
    })

    test('should not call persistFileMetadata for invalid v1 message', async () => {
      await expect(processV1FileMetadata({})).rejects.toThrow(UnprocessableMessageError)
      expect(mockPersistFileMetadata).not.toHaveBeenCalled()
    })

    test('should throw UNPROCESSABLE_MESSAGE error for invalid v1 message', async () => {
      await expect(processV1FileMetadata({})).rejects.toThrow(UnprocessableMessageError)
      expect(mockLoggerError).toHaveBeenCalledWith('Invalid message: "id" is required,"metadata" is required')
    })
  })

  describe('v2 message', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('should call persistFileMetadata for valid v2 message', async () => {
      await processV2FileMetadata(v2FileMetadataMessage)
      expect(mockPersistFileMetadata).toHaveBeenCalledWith(v2FileMetadataMessage)
    })

    test('should not call persistFileMetadata for invalid v2 message', async () => {
      await expect(processV2FileMetadata({})).rejects.toThrow(UnprocessableMessageError)
      expect(mockPersistFileMetadata).not.toHaveBeenCalled()
    })

    test('should throw UNPROCESSABLE_MESSAGE error for invalid v2 message', async () => {
      await expect(processV2FileMetadata({})).rejects.toThrow(UnprocessableMessageError)
      expect(mockLoggerError).toHaveBeenCalledWith('Invalid message: "id" is required,"source" is required,"specversion" is required,"type" is required,"datacontenttype" is required,"time" is required,"data" is required')
    })
  })
})
