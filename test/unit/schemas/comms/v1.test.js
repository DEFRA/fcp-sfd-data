import { describe, test, expect, beforeEach } from '@jest/globals'

import commsDataMessage from '../../../mocks/comms-message/v1.js'

import { validate } from '../../../../src/schemas/validate.js'
import { v1 } from '../../../../src/schemas/comms/index.js'

describe('comms data event v1 schema validation', () => {
  let mockV1Message

  beforeEach(() => {
    mockV1Message = {
      ...commsDataMessage,
      commsMessage: {
        ...commsDataMessage.commsMessage
      }
    }
  })

  test('valid object should return message', async () => {
    const [value, errors] = await validate(v1, commsDataMessage)

    expect(value).toBeTruthy()
    expect(errors).toBeNull()
  })

  describe('required / optional fields', () => {
    beforeEach(() => {
      mockV1Message = {
        ...commsDataMessage,
        commsMessage: {
          ...commsDataMessage.commsMessage
        }
      }
    })

    test.each([
      ['id'],
      ['commsMessage']
    ])('missing data %s should return error', async (field) => {
      delete mockV1Message[field]

      const [value, errors] = await validate(v1, mockV1Message)

      expect(value).toBeNull()
      expect(errors).toBeTruthy()
      expect(errors).toContainEqual(`"${field}" is required`)
    })
  })

  describe('id', () => {
    beforeEach(() => {
      mockV1Message.id = 'fbbfcf4c-5fc1-4c0c-9fc3-a113be6c8314'
    })

    test.each([
      ['fbbfcf4c-5fc1-4c0c-9fc3-a113be6c8314']
    ])('valid V4 UUID %s should return message', async (id) => {
      mockV1Message.id = id

      const [value, errors] = await validate(v1, mockV1Message)

      expect(value).toBeTruthy()
      expect(errors).toBeNull()
    })

    test.each([
      [12345, '"id" must be a string'],
      ['sshdjkf', '"id" must be a valid GUID']
    ])('invalid V4 UUID %s should return error', async (id, expectedMessage) => {
      mockV1Message.id = id

      const [value, errors] = await validate(v1, mockV1Message)

      expect(value).toBeNull()
      expect(errors).toBeTruthy()
      expect(errors).toContainEqual(expectedMessage)
    })
  })

  describe('commsMessage', () => {
    beforeEach(() => {
      mockV1Message = {
        ...commsDataMessage,
        commsMessage: {
          ...commsDataMessage.commsMessage
        }
      }
    })

    test('valid object should return value', async () => {
      mockV1Message.commsMessage = commsDataMessage.commsMessage

      const [value, errors] = await validate(v1, mockV1Message)

      expect(value).toBeTruthy()
      expect(errors).toBeNull()
    })

    test('invalid object should return error', async () => {
      mockV1Message.commsMessage = ''

      const [value, errors] = await validate(v1, mockV1Message)

      expect(value).toBeNull()
      expect(errors).toBeTruthy()
      expect(errors).toContainEqual('"commsMessage" must be of type object')
    })
  })
})
