import { vi, describe, test, expect, beforeEach } from 'vitest'

import { NotFoundError } from '../../../src/errors/not-found-error.js'
import { createLogger } from '../../../src/logging/logger.js'

import {
  checkIdempotency,
  getById,
  saveEvent
} from '../../../src/repos/common/index.js'

import {
  persistCommsNotification,
  getCommsEventById,
  getCommsEventByReference
} from '../../../src/repos/comms/comms-message.js'
import getByReference from '../../../src/repos/comms/get-by-reference.js'

import mockNotification from '../../mocks/comms-message/v1.js'

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
    getById.mockRejectedValue(new NotFoundError('No document found'))

    await expect(getCommsEventById(mockId))
      .rejects
      .toThrowError('No document found')

    expect(getById).toHaveBeenCalledWith('notificationEvents', mockId)
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
