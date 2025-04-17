import { jest, describe, test, expect, beforeEach } from '@jest/globals'
import { GraphQLError } from 'graphql'

import mockEvent from '../../mocks/file-metadata/v1.js'

const mockSaveEvent = jest.fn()
jest.unstable_mockModule('../../../src/repos/common/save-event.js', () => ({
  default: mockSaveEvent
}))

const mockGetByProperty = jest.fn()
jest.unstable_mockModule('../../../src/repos/common/get-by-property.js', () => ({
  default: mockGetByProperty
}))

const mockGetById = jest.fn()
jest.unstable_mockModule('../../../src/repos/common/get-by-id.js', () => ({
  default: mockGetById
}))

const mockCheckIdempotency = jest.fn()
jest.unstable_mockModule('../../../src/repos/common/check-idempotency.js', () => ({
  default: mockCheckIdempotency
}))

const mockLoggerInfo = jest.fn()
const mockLoggerError = jest.fn()

jest.unstable_mockModule('../../../src/logging/logger.js', () => ({
  createLogger: () => ({
    info: (...args) => mockLoggerInfo(...args),
    error: (...args) => mockLoggerError(...args)
  })
}))

const mockKey = 'mockKey'
const mockValue = 'mockValue'
const mockId = 'mockId'

const { persistFileMetadata, getMetadataByProperty, getMetadataById } = await import('../../../src/repos/file-metadata.js')

describe('Persist file metadata', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('should call saveEvent with the correct collection and event', async () => {
    await persistFileMetadata(mockEvent)

    expect(mockSaveEvent).toHaveBeenCalledWith('fileMetadataEvents', mockEvent)
  })

  test('should throw an error if saveEvent fails', async () => {
    mockSaveEvent.mockRejectedValue(new Error('Database error'))

    await expect(persistFileMetadata(mockEvent))
      .rejects
      .toThrowError('Database error')

    expect(mockSaveEvent).toHaveBeenCalledWith('fileMetadataEvents', mockEvent)
  })

  test('should log "File metadata message already processed" when checkIdempotency returns true', async () => {
    mockCheckIdempotency.mockReturnValue(true)

    await (persistFileMetadata(mockEvent))

    expect(mockLoggerInfo).toHaveBeenCalledWith(`File metadata message already processed, eventId: ${mockEvent.id}`)
  })

  test('should log "Comms message processed successfully" when checkIdempotency returns false', async () => {
    mockCheckIdempotency.mockReturnValue(false)

    await (persistFileMetadata(mockEvent))

    expect(mockLoggerInfo).toHaveBeenCalledWith(`File metadata message processed successfully, eventId: ${mockEvent.id}`)
  })
})

describe('Get metadata by property', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call mockGetByProperty with the correct collection and event', async () => {
    await getMetadataByProperty(mockKey, mockValue)

    expect(mockGetByProperty).toHaveBeenCalledWith('fileMetadataEvents', mockKey, mockValue)
  })

  test('should throw an error if saveEvent fails', async () => {
    mockGetByProperty.mockRejectedValue(new Error('Error while persisting file metadata event: Database error'))

    await expect(getMetadataByProperty(mockKey, mockValue))
      .rejects
      .toThrow('Error while persisting file metadata event: Database error')
    expect(mockGetByProperty).toHaveBeenCalledWith('fileMetadataEvents', mockKey, mockValue)
  })
})

describe('Get file metadata by id', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
