import { describe, test, expect } from 'vitest'

import { UnprocessableMessageError } from '../../../../../../src/errors/message-errors.js'

import {
  processV1CommsData,
  processV2CommsData
} from '../../../../../../src/messaging/inbound/data-ingest/processors/comms.js'

import {
  processV1FileMetadata,
  processV2FileMetadata
} from '../../../../../../src/messaging/inbound/data-ingest/processors/file-metadata.js'

import { getProcessor } from '../../../../../../src/messaging/inbound/data-ingest/processors/processor.js'

import v1CommsMessage from '../../../../../mocks/comms-message/v1.js'
import v2CommsMessage from '../../../../../mocks/data-ingest/v1CommsMessage.js'

import v1FileMetadata from '../../../../../mocks/file-metadata/v1.js'
import v2FileMetadata from '../../../../../mocks/data-ingest/v1FileMetadata.js'

describe('processor version selection', () => {
  test('unknown message type should throw unprocessable message', () => {
    const message = {}

    expect(() => getProcessor(message)).toThrow(UnprocessableMessageError)
  })

  describe('comms data', () => {
    test('v1 message should use v1 processor', () => {
      const processor = getProcessor(v1CommsMessage)

      expect(processor).toBe(processV1CommsData)
    })

    test('v2 message should use v2 processor', () => {
      const processor = getProcessor(v2CommsMessage)

      expect(processor).toBe(processV2CommsData)
    })
  })

  describe('file metadata', () => {
    test('v1 message should use v1 processor', () => {
      const processor = getProcessor(v1FileMetadata)

      expect(processor).toBe(processV1FileMetadata)
    })

    test('v2 message should use v2 processor', () => {
      const processor = getProcessor(v2FileMetadata)

      expect(processor).toBe(processV2FileMetadata)
    })
  })
})
