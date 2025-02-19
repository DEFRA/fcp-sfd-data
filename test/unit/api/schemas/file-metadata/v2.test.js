import { describe, test, expect, beforeEach } from '@jest/globals'

import fileMetadataMessage from '../../../../mocks/file-metadata/v2.js'

import { validate } from '../../../../../src/schemas/validate.js'
import { v2 } from '../../../../../src/schemas/file-metadata/index.js'

describe('file metadata event v1 schema validation', () => {
  let mockV2Message

  beforeEach(() => {
    mockV2Message = {
      ...fileMetadataMessage,
      data: {
        ...fileMetadataMessage.data
      }
    }
  })

  test('valid object should return message', async () => {
    const [value, errors] = await validate(v2, fileMetadataMessage)

    expect(value).toBeTruthy()
    expect(errors).toBeNull()
  })

  describe('required / optional fields', () => {
    beforeEach(() => {
      mockV2Message = {
        ...fileMetadataMessage,
        data: {
          ...fileMetadataMessage.data
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
      delete mockV2Message[field]

      const [value, error] = await validate(v2, mockV2Message)

      expect(value).toBeNull()
      expect(error).toBeTruthy()
      expect(error).toContainEqual(`"${field}" is required`)
    })
  })

  describe('id', () => {
    beforeEach(() => {
      mockV2Message.id = 'fbbfcf4c-5fc1-4c0c-9fc3-a113be6c8314'
    })

    test.each([
      ['fbbfcf4c-5fc1-4c0c-9fc3-a113be6c8314']
    ])('valid V4 UUID %s should return message', async (id) => {
      mockV2Message.id = id

      const [value, errors] = await validate(v2, mockV2Message)

      expect(value).toBeTruthy()
      expect(errors).toBeNull()
    })

    test.each([
      [12345, '"id" must be a string'],
      ['sshdjkf', '"id" must be a valid GUID']
    ])('invalid V4 UUID %s should return error', async (id, expectedMessage) => {
      mockV2Message.id = id

      const [value, errors] = await validate(v2, mockV2Message)

      expect(value).toBeNull()
      expect(errors).toBeTruthy()
      expect(errors).toContainEqual(expectedMessage)
    })
  })
})
