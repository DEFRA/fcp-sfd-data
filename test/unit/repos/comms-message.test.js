import { jest, describe, test, expect, beforeEach } from '@jest/globals'
import { GraphQLError } from 'graphql'

import mockNotification from '../../mocks/comms-message/v1.js'

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

const mockKey = 'mockKey'
const mockValue = 'mockValue'
const mockId = 'mockId'

const mockLoggerInfo = jest.fn()
const mockLoggerError = jest.fn()

jest.unstable_mockModule('../../../src/logging/logger.js', () => ({
  createLogger: () => ({
    info: (...args) => mockLoggerInfo(...args),
    error: (...args) => mockLoggerError(...args)
  })
}))

const { persistCommsNotification, getCommsEventByProperty, getCommsEventById } = await import('../../../src/repos/comms-message.js')

describe('Persist comms notification', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('should call saveEvent with the correct collection and notification', async () => {
    await persistCommsNotification(mockNotification)

    expect(mockSaveEvent).toHaveBeenCalledWith('notificationEvents', mockNotification)
  })

  test('should throw an error if saveEvent fails', async () => {
    mockSaveEvent.mockRejectedValue(new Error('Database error'))

    await expect(persistCommsNotification(mockNotification))
      .rejects
      .toThrowError('Database error')

    expect(mockSaveEvent).toHaveBeenCalledWith('notificationEvents', mockNotification)
  })

  test('should log "notification already processed" when checkIdempotency returns true', async () => {
    mockCheckIdempotency.mockReturnValue(true)

    await persistCommsNotification(mockNotification)

    expect(mockLoggerInfo).toHaveBeenCalledWith(`Notification already processed, eventId: ${mockNotification.id}`)
  })

  test('should log "Comms message processed successfully" when checkIdempotency returns false', async () => {
    mockCheckIdempotency.mockReturnValue(false)

    await persistCommsNotification(mockNotification)

    expect(mockLoggerInfo).toHaveBeenCalledWith(`Comms message processed successfully, eventId: ${mockNotification.id}`)
  })
})

describe('Get comms event by id', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call getById with the correct collection and key-value pair', async () => {
    await getCommsEventById(mockId)

    expect(mockGetById).toHaveBeenCalledWith('notificationEvents', mockId)
  })

  test('should throw an error if getById fails', async () => {
    mockGetById.mockRejectedValue(new GraphQLError('No document found'))

    await expect(getCommsEventById(mockId))
      .rejects
      .toThrowError('Error while fetching comms notifications: No document found')

    expect(mockGetById).toHaveBeenCalledWith('notificationEvents', mockId)
  })
})

describe('Get comms event by property', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call getByProperty with the correct collection and key-value pair', async () => {
    await getCommsEventByProperty(mockKey, mockValue)

    expect(mockGetByProperty).toHaveBeenCalledWith('notificationEvents', mockKey, mockValue)
  })

  test('should throw an error if getCommsEventByProperty returns no documents', async () => {
    mockGetByProperty.mockRejectedValue(new GraphQLError('No document found'))

    await expect(getCommsEventByProperty(mockKey, mockValue))
      .rejects
      .toThrowError('Error while fetching comms notifications: No document found')

    expect(mockGetByProperty).toHaveBeenCalledWith('notificationEvents', mockKey, mockValue)
  })
})
