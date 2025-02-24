import { describe, test, expect, beforeEach } from '@jest/globals'

import dataIngestMessage from '../../../mocks/data-ingest/v1CommsMessage.js'

import { validate } from '../../../../src/schemas/validate.js'
import { v1 } from '../../../../src/schemas/data-ingest/index.js'

describe('data ingest event v1 schema validation', () => {
  let mockV1Message

  beforeEach(() => {
    mockV1Message = {
      ...dataIngestMessage,
      data: {
        ...dataIngestMessage.data
      }
    }
  })

  test('valid object should return message', async () => {
    const [value, errors] = await validate(v1, dataIngestMessage)

    expect(value).toBeTruthy()
    expect(errors).toBeNull()
  })

  describe('required / optional fields', () => {
    beforeEach(() => {
      mockV1Message = {
        ...dataIngestMessage,
        data: {
          ...dataIngestMessage.data
        }
      }
    })

    test.each([
      ['id'],
      ['source'],
      ['specversion'],
      ['type'],
      ['datacontenttype'],
      ['time'],
      ['data']
    ])('missing CloudEvent %s should return error', async (field) => {
      delete mockV1Message[field]

      const [value, errors] = await validate(v1, mockV1Message)

      expect(value).toBeNull()
      expect(errors).toBeTruthy()
      expect(errors).toBeInstanceOf(Error)
      expect(errors.message).toContain(`"${field}" is required`)
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
      expect(errors).toBeInstanceOf(Error)
      expect(errors.message).toContain(expectedMessage)
    })
  })
})
