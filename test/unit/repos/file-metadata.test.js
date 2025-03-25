import { jest, describe, test, expect, beforeEach } from '@jest/globals'
import mockEvent from '../../mocks/file-metadata/v1.js'

const mockSaveEvent = jest.fn()
jest.unstable_mockModule('../../../src/repos/common/save-event.js', () => ({
  default: mockSaveEvent
}))

const { persistFileMetadata } = await import('../../../src/repos/file-metadata.js')

describe('persistFileMetadata', () => {
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
