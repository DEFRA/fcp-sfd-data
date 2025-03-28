import { jest, describe, test, expect, beforeEach } from '@jest/globals'
import mockEvent from '../../mocks/file-metadata/v1.js'

const mockSaveEvent = jest.fn()
jest.unstable_mockModule('../../../src/repos/common/save-event.js', () => ({
  default: mockSaveEvent
}))

const mockGetByProperty = jest.fn()
jest.unstable_mockModule('../../../src/repos/common/get-by-property.js', () => ({
  default: mockGetByProperty
}))

const mockKey = 'mockKey'
const mockValue = 'mockValue'

const { persistFileMetadata, getMetadataByProperty } = await import('../../../src/repos/file-metadata.js')

describe('Persist file metadata', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call saveEvent with the correct collection and event', async () => {
    await persistFileMetadata(mockEvent)

    expect(mockSaveEvent).toHaveBeenCalledWith('fileMetadataEvents', mockEvent)
  })

  test('should throw an error if saveEvent fails', async () => {
    mockSaveEvent.mockRejectedValue(new Error('Database error'))

    await expect(persistFileMetadata(mockEvent))
      .rejects
      .toThrowError('Error while persisting file metadata event: Database error')

    expect(mockSaveEvent).toHaveBeenCalledWith('fileMetadataEvents', mockEvent)
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
