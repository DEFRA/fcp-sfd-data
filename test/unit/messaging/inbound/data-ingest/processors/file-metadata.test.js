import { vi, describe, test, expect, beforeEach } from 'vitest'

import { createLogger } from '../../../../../../src/logging/logger.js'
import { UnprocessableMessageError } from '../../../../../../src/errors/message-errors.js'

import v1FileMetadataMessage from '../../../../../mocks/file-metadata/v1.js'
import v2FileMetadataMessage from '../../../../../mocks/data-ingest/v1FileMetadata.js'

vi.mock('../../../../../../src/logging/logger.js', () => ({
  createLogger: vi.fn().mockReturnValue({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  })
}))

const logger = createLogger()

const persistFileMetadata = vi.fn()
vi.mock('../../../../../../src/repos/metadata/file-metadata.js', () => ({
  persistFileMetadata
}))

const {
  processV1FileMetadata,
  processV2FileMetadata
} = await import('../../../../../../src/messaging/inbound/data-ingest/processors/file-metadata.js')

describe('file metadata message processor', () => {
  describe('v1 message', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    test('should call persistFileMetadata for valid v1 message', async () => {
      await processV1FileMetadata(v1FileMetadataMessage)
      expect(persistFileMetadata).toHaveBeenCalledWith(v1FileMetadataMessage.metadata)
    })

    test('should not call persistFileMetadata for invalid v1 message', async () => {
      await expect(processV1FileMetadata({})).rejects.toThrow(UnprocessableMessageError)
      expect(persistFileMetadata).not.toHaveBeenCalled()
    })

    test('should throw UNPROCESSABLE_MESSAGE error for invalid v1 message', async () => {
      await expect(processV1FileMetadata({})).rejects.toThrow(UnprocessableMessageError)
      expect(logger.error).toHaveBeenCalledWith('Invalid message: "id" is required,"metadata" is required')
    })
  })

  describe('v2 message', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    test('should call persistFileMetadata for valid v2 message', async () => {
      await processV2FileMetadata(v2FileMetadataMessage)
      expect(persistFileMetadata).toHaveBeenCalledWith(v2FileMetadataMessage)
    })

    test('should not call persistFileMetadata for invalid v2 message', async () => {
      await expect(processV2FileMetadata({})).rejects.toThrow(UnprocessableMessageError)
      expect(persistFileMetadata).not.toHaveBeenCalled()
    })

    test('should throw UNPROCESSABLE_MESSAGE error for invalid v2 message', async () => {
      await expect(processV2FileMetadata({})).rejects.toThrow(UnprocessableMessageError)
      expect(logger.error).toHaveBeenCalledWith('Invalid message: "id" is required,"source" is required,"specversion" is required,"type" is required,"datacontenttype" is required,"time" is required,"data" is required')
    })
  })
})
