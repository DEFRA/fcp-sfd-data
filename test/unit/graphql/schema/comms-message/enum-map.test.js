import { describe, test, expect } from 'vitest'
import enumMap from '../../../../../src/graphql/schema/comms-message/enum-map.js'

describe('Comms Message Enum Map', () => {
  test('should map all enum values to correct data paths', () => {
    expect(enumMap).toEqual({
      ID: 'id',
      TIME: 'time',
      TYPE: 'type',
      SOURCE: 'source',
      SPECVERSION: 'specversion',
      CRN: 'data.crn',
      SBI: 'data.sbi',
      COMMS_TYPE: 'data.commsType',
      REFERENCE: 'data.reference',
      COMMS_ADDRESSES: 'data.commsAddresses',
      SOURCE_SYSTEM: 'data.sourceSystem',
      EMAIL_REPLY_TO_ID: 'data.emailReplyToId',
      STATUS_DETAILS: 'data.statusDetails',
      CORRELATION_ID: 'data.correlationId',
      PERSONALISATION: 'data.personalisation',
      NOTIFY_TEMPLATE_ID: 'data.notifyTemplateId'
    })
  })

  test('should map data fields to include data prefix', () => {
    const dataFields = [
      'CRN',
      'SBI',
      'COMMS_TYPE',
      'REFERENCE',
      'COMMS_ADDRESSES',
      'SOURCE_SYSTEM',
      'EMAIL_REPLY_TO_ID',
      'STATUS_DETAILS',
      'CORRELATION_ID',
      'PERSONALISATION',
      'NOTIFY_TEMPLATE_ID'
    ]

    dataFields.forEach(field => {
      expect(enumMap[field]).toMatch(/^data\./)
    })
  })

  test('should map top-level fields without data prefix', () => {
    const topLevelFields = [
      'ID',
      'TIME',
      'TYPE',
      'SOURCE',
      'SPECVERSION'
    ]

    topLevelFields.forEach(field => {
      expect(enumMap[field]).not.toMatch(/^data\./)
    })
  })
})
