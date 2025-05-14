import { vi, describe, test, expect, beforeEach } from 'vitest'
import { GraphQLError } from 'graphql'
import { NotFoundError } from '../../../src/errors/not-found-error.js'

import { createLogger } from '../../../src/logging/logger.js'

import mockNotification from '../../mocks/comms-message/v1.js'
import saveEvent from '../../../src/repos/common/save-event.js'
import getByProperty from '../../../src/repos/common/get-by-property.js'
import getById from '../../../src/repos/common/get-by-id.js'
import getByReference from '../../../src/repos/comms/get-by-reference.js'
import checkIdempotency from '../../../src/repos/common/check-idempotency.js'

import { persistCommsNotification, getCommsEventByProperty, getCommsEventById, getCommsEventByReference } from '../../../src/repos/comms/comms-message.js'

vi.mock('../../../src/repos/common/save-event.js', () => {
  return {
    default: vi.fn()
  }
})

vi.mock('../../../src/repos/common/get-by-property.js', () => {
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

vi.mock('../../../src/repos/comms/get-by-reference.js', () => {
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

const mockKey = 'mockKey'
const mockValue = 'mockValue'
const mockId = 'mockId'
const mockReference = 'mockReference'

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

  test('should call getByProperty with the correct collection and key-value pair', async () => {
    await getCommsEventByProperty(mockKey, mockValue)

    expect(getByProperty).toHaveBeenCalledWith('notificationEvents', mockKey, mockValue)
  })

  test('should throw an error if getCommsEventByProperty returns no documents', async () => {
    getByProperty.mockRejectedValue(new GraphQLError('No document found'))

    await expect(getCommsEventByProperty(mockKey, mockValue))
      .rejects
      .toThrowError('Error while fetching comms notifications: No document found')

    expect(getByProperty).toHaveBeenCalledWith('notificationEvents', mockKey, mockValue)
  })
})

describe('Get comms event by reference', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should call getByReference with the correct collection and reference', async () => {
    await getCommsEventByReference(mockReference)

    expect(getByReference).toHaveBeenCalledWith('notificationEvents', mockReference)
  })

  test('should throw an error if getCommsEventByReference returns no documents', async () => {
    getByReference.mockRejectedValue(new NotFoundError('No document found'))

    await expect(getCommsEventByReference(mockReference))
      .rejects
      .toThrowError('No document found')

    expect(getByReference).toHaveBeenCalledWith('notificationEvents', mockReference)
  })
})
