import { describe, test, expect, beforeEach } from '@jest/globals'

import fileMetadataMessage from '../../../mocks/file-metadata/v1.js'

import { validate } from '../../../../src/schemas/validate.js'
import { v1 } from '../../../../src/schemas/file-metadata/index.js'

describe('file metadata event v1 schema validation', () => {
  let mockV1Message

  beforeEach(() => {
    mockV1Message = {
      ...fileMetadataMessage,
      metadata: {
        ...fileMetadataMessage.metadata
      }
    }
  })

  test('valid message should return message', async () => {
    const [value, errors] = await validate(v1, fileMetadataMessage)

    expect(value).toBeTruthy()
    expect(errors).toBeNull()
  })

  test('null message should return error', async () => {
    const [value, errors] = await validate(v1, null)

    expect(errors).toBeTruthy()
    expect(value).toBeNull()
  })

  describe('required / optional fields', () => {
    beforeEach(() => {
      mockV1Message = {
        ...fileMetadataMessage,
        metadata: {
          ...fileMetadataMessage.metadata
        }
      }
    })

    test.each([
      ['id'],
      ['metadata']
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

  describe('metadata', () => {
    beforeEach(() => {
      mockV1Message = {
        ...fileMetadataMessage,
        metadata: {
          ...fileMetadataMessage.metadata
        }
      }
    })

    test('valid metadata object should return value', async () => {
      mockV1Message.metadata = fileMetadataMessage.metadata

      const [value, errors] = await validate(v1, mockV1Message)

      expect(value).toBeTruthy()
      expect(errors).toBeNull()
    })

    test('invalid metadata object should return error', async () => {
      mockV1Message.metadata = ''

      const [value, errors] = await validate(v1, mockV1Message)

      expect(value).toBeNull()
      expect(errors).toBeTruthy()
      expect(errors).toContainEqual('"metadata" must be of type object')
    })
  })
})
