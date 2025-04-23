import { describe, test, expect, beforeEach, vi, it } from 'vitest'
import { GraphQLError } from 'graphql'

import { createLogger } from '../../../src/logging/logger.js'

import mockNotification from '../../mocks/comms-message/v1.js'

const saveEvent = vi.fn()
const getByProperty = vi.fn()
const getById = vi.fn()
const checkIdempotency = vi.fn()

vi.mock('../../../src/repos/common/save-event.js', () => ({
  default: saveEvent
}))

vi.mock('../../../src/repos/common/get-by-property.js', () => ({
  default: getByProperty
}))

vi.mock('../../../src/repos/common/get-by-id.js', () => ({
  default: getById
}))

vi.mock('../../../src/repos/common/check-idempotency.js', () => ({
  default: checkIdempotency
}))

vi.mock('../../../src/logging/logger.js', () => ({
  createLogger: vi.fn().mockReturnValue({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  })
}))

const { persistCommsNotification, getCommsEventByProperty, getCommsEventById } = await import('../../../src/repos/comms-message.js')

const mockId = 'mockId'

const mockLogger = createLogger()

describe('Persist comms notification', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  test('should call saveEvent with the correct collection and notification', async () => {
    await persistCommsNotification(mockNotification)

    expect(saveEvent).toHaveBeenCalledWith('notificationEvents', mockNotification)
  })

  test('should throw an error if saveEvent fails', async () => {
    saveEvent.mockRejectedValue(new Error('Database error'))

    await expect(persistCommsNotification(mockNotification))
      .rejects
      .toThrowError('Database error')

    expect(saveEvent).toHaveBeenCalledWith('notificationEvents', mockNotification)
  })

  test('should log "notification already processed" when checkIdempotency returns true', async () => {
    checkIdempotency.mockReturnValue(true)

    await persistCommsNotification(mockNotification)

    expect(mockLogger.info).toHaveBeenCalledWith(`Notification already processed, eventId: ${mockNotification.id}`)
  })

  test('should log "Comms message processed successfully" when checkIdempotency returns false', async () => {
    checkIdempotency.mockReturnValue(false)

    await persistCommsNotification(mockNotification)

    expect(mockLogger.info).toHaveBeenCalledWith(`Comms message processed successfully, eventId: ${mockNotification.id}`)
  })
})

describe('Get comms event by id', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should call getById with the correct collection and key-value pair', async () => {
    await getCommsEventById(mockId)

    expect(getById).toHaveBeenCalledWith('notificationEvents', mockId)
  })

  test('should throw an error if getById fails', async () => {
    getById.mockRejectedValue(new GraphQLError('No document found'))

    await expect(getCommsEventById(mockId))
      .rejects
      .toThrowError('Error while fetching comms notifications: No document found')

    expect(getById).toHaveBeenCalledWith('notificationEvents', mockId)
  })
})

describe('Get comms event by property', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call getByProperty with the correct mapped path', async () => {
    const mockKey = 'CRN'
    const mockValue = 'mockValue'
    const mockResult = [{ eventId: 'mockEventId' }]
    getByProperty.mockResolvedValue(mockResult)

    const result = await getCommsEventByProperty(mockKey, mockValue)

    expect(getByProperty).toHaveBeenCalledWith(
      'notificationEvents',
      'events.data.crn',
      mockValue
    )
    expect(result).toBe(mockResult)
  })

  it('should resolve with an empty array if getByProperty returns no documents', async () => {
    const mockKey = 'CRN'
    const mockValue = 'mockValue'

    getByProperty.mockResolvedValue([])

    await expect(getCommsEventByProperty(mockKey, mockValue)).resolves.toEqual([])

    expect(getByProperty).toHaveBeenCalledWith(
      'notificationEvents',
      'events.data.crn',
      mockValue
    )
  })
})
