import { vi, describe, test, expect, beforeEach } from 'vitest'

import { NotFoundError } from '../../../src/errors/not-found-error.js'

import { createLogger } from '../../../src/logging/logger.js'

import {
  checkIdempotency,
  getById,
  saveEvent
} from '../../../src/repos/common/index.js'

import {
  persistFileMetadata,
  getMetadataById
} from '../../../src/repos/metadata/file-metadata.js'

import mockEvent from '../../mocks/file-metadata/v1.js'

vi.mock('../../../src/repos/common/save-event.js', () => {
  return {
    default: vi.fn()
  }
})

vi.mock('../../../src/repos/common/get-by-id.js', () => {
  return {
    default: vi.fn()
  }
})

vi.mock('../../../src/repos/common/check-idempotency.js', () => {
  return {
    default: vi.fn()
  }
})

vi.mock('../../../src/logging/logger.js', () => ({
  createLogger: vi.fn().mockReturnValue({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  })
}))

const mockId = 'mockId'

const mockLogger = createLogger()

describe('Persist file metadata', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  test('should call saveEvent with the correct collection and event', async () => {
    await persistFileMetadata(mockEvent)

    expect(saveEvent).toHaveBeenCalledWith('fileMetadataEvents', mockEvent)
  })

  test('should throw an error if saveEvent fails', async () => {
    saveEvent.mockRejectedValue(new Error('Database error'))

    await expect(persistFileMetadata(mockEvent))
      .rejects
      .toThrowError('Database error')

    expect(saveEvent).toHaveBeenCalledWith('fileMetadataEvents', mockEvent)
  })

  test('should log "File metadata message already processed" when checkIdempotency returns true', async () => {
    checkIdempotency.mockReturnValue(true)

    await (persistFileMetadata(mockEvent))

    expect(mockLogger.info).toHaveBeenCalledWith(`File metadata message already processed, eventId: ${mockEvent.id}`)
  })

  test('should log "Comms message processed successfully" when checkIdempotency returns false', async () => {
    checkIdempotency.mockReturnValue(false)

    await (persistFileMetadata(mockEvent))

    expect(mockLogger.info).toHaveBeenCalledWith(`File metadata message processed successfully, eventId: ${mockEvent.id}`)
  })
})

describe('Get file metadata by id', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should call getById with the correct collection and key-value pair', async () => {
    await getMetadataById(mockId)

    expect(getById).toHaveBeenCalledWith('fileMetadataEvents', mockId)
  })

  test('should throw an error if getById fails', async () => {
    getById.mockRejectedValue(new NotFoundError('No document found'))

    await expect(getMetadataById(mockId))
      .rejects
      .toThrowError('No document found')

    expect(getById).toHaveBeenCalledWith('fileMetadataEvents', mockId)
  })
})
