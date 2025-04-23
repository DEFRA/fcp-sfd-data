import { vi, describe, test, expect, beforeEach, it } from 'vitest'
import { GraphQLError } from 'graphql'

import mockMetadata from '../../mocks/file-metadata/v1.js'

const mockSaveEvent = vi.fn()
const mockGetByProperty = vi.fn()
const mockGetById = vi.fn()
const mockCheckIdempotency = vi.fn()
const mockLoggerInfo = vi.fn()
const mockLoggerError = vi.fn()

vi.mock('../../../src/repos/common/save-event.js', () => ({
  default: mockSaveEvent
}))

vi.mock('../../../src/repos/common/get-by-property.js', () => ({
  default: mockGetByProperty
}))

vi.mock('../../../src/repos/common/get-by-id.js', () => ({
  default: mockGetById
}))

vi.mock('../../../src/repos/common/check-idempotency.js', () => ({
  default: mockCheckIdempotency
}))

vi.mock('../../../src/logging/logger.js', () => ({
  createLogger: () => ({
    info: (...args) => mockLoggerInfo(...args),
    error: (...args) => mockLoggerError(...args)
  })
}))

const mockId = 'mockId'

const { persistFileMetadata, getMetadataByProperty, getMetadataById } = await import('../../../src/repos/file-metadata.js')

describe('Persist file metadata', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  test('should call saveEvent with the correct collection and event', async () => {
    await persistFileMetadata(mockMetadata)

    expect(mockSaveEvent).toHaveBeenCalledWith('fileMetadataEvents', mockMetadata)
  })

  test('should throw an error if saveEvent fails', async () => {
    mockSaveEvent.mockRejectedValue(new Error('Database error'))

    await expect(persistFileMetadata(mockMetadata))
      .rejects
      .toThrowError('Database error')

    expect(mockSaveEvent).toHaveBeenCalledWith('fileMetadataEvents', mockMetadata)
  })

  test('should log "File metadata message already processed" when checkIdempotency returns true', async () => {
    mockCheckIdempotency.mockReturnValue(true)

    await (persistFileMetadata(mockMetadata))

    expect(mockLoggerInfo).toHaveBeenCalledWith(`File metadata message already processed, eventId: ${mockMetadata.id}`)
  })

  test('should log "Comms message processed successfully" when checkIdempotency returns false', async () => {
    mockCheckIdempotency.mockReturnValue(false)

    await (persistFileMetadata(mockMetadata))

    expect(mockLoggerInfo).toHaveBeenCalledWith(`File metadata message processed successfully, eventId: ${mockMetadata.id}`)
  })
})

describe('Get metadata by property', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call getByProperty with the correct mapped path', async () => {
    const mockKey = 'SBI'
    const mockValue = 'mockValue'
    const mockResult = [{ metadataId: 'mockMetadataId' }]
    mockGetByProperty.mockResolvedValue(mockResult)

    const result = await getMetadataByProperty(mockKey, mockValue)

    expect(mockGetByProperty).toHaveBeenCalledWith(
      'fileMetadataEvents',
      'events.data.sbi',
      mockValue
    )
    expect(result).toBe(mockResult)
  })

  it('should resolve with an empty array if getByProperty returns no documents', async () => {
    const mockKey = 'SBI'
    const mockValue = 'mockValue'

    mockGetByProperty.mockResolvedValue([])

    await expect(getMetadataByProperty(mockKey, mockValue)).resolves.toEqual([])

    expect(mockGetByProperty).toHaveBeenCalledWith(
      'fileMetadataEvents',
      'events.data.sbi',
      mockValue
    )
  })
})

describe('Get file metadata by id', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should call getById with the correct collection and key-value pair', async () => {
    await getMetadataById(mockId)

    expect(mockGetById).toHaveBeenCalledWith('fileMetadataEvents', mockId)
  })

  test('should throw an error if getById fails', async () => {
    mockGetById.mockRejectedValue(new GraphQLError('No document found'))

    await expect(getMetadataById(mockId))
      .rejects
      .toThrowError('Error while fetching comms notifications: No document found')

    expect(mockGetById).toHaveBeenCalledWith('fileMetadataEvents', mockId)
  })
})
