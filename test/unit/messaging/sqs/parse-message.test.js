import { describe, test, expect } from '@jest/globals'

import { UnprocessableMessageError } from '../../../../src/errors/message-errors.js'

import sqsMessage from '../../../mocks/aws/sqs-message.js'
import snsSqsMessage from '../../../mocks/aws/sns-sqs-message.js'

import { parseSqsMessage } from '../../../../src/messaging/sqs/parse-message.js'

describe('sqs message parser', () => {
  test('sqs message should return message object', () => {
    const messageBody = parseSqsMessage(sqsMessage)

    expect(messageBody).toEqual({
      id: '550e8400-e29b-41d4-a716-446655440000',
      metadata: {
        id: '123e4567-e89b-12d3-a456-426655440000',
        source: '/mycontext',
        type: 'uk.gov.fcp.sfd.object.av.clean',
        specversion: '1.0',
        datacontenttype: 'application/json',
        time: '2023-10-17T14:48:00.000Z',
        data: {
          sbi: '123456789',
          blobReference: '550e8400-e29b-41d4-a716-446655440000'
        }
      }
    })
  })

  test('sns notification should return message object', () => {
    const messageBody = parseSqsMessage(snsSqsMessage)

    expect(messageBody).toEqual({
      id: '550e8400-e29b-41d4-a716-446655440000',
      metadata: {
        id: '123e4567-e89b-12d3-a456-426655440000',
        source: '/mycontext',
        type: 'uk.gov.fcp.sfd.object.av.clean',
        specversion: '1.0',
        datacontenttype: 'application/json',
        time: '2023-10-17T14:48:00.000Z',
        data: {
          sbi: '123456789',
          blobReference: '550e8400-e29b-41d4-a716-446655440000'
        }
      }
    })
  })

  test('invalid message body should throw unprocessable message', () => {
    const messageBody = {
      MessageId: '92f0175e-26c7-4902-80bf-42f0ca9e0969',
      Body: '{]'
    }

    expect(() => parseSqsMessage(messageBody)).toThrow(UnprocessableMessageError)
  })

  test('missing message body should throw unprocessable message', () => {
    const messageBody = {
      MessageId: '92f0175e-26c7-4902-80bf-42f0ca9e0969'
    }

    expect(() => parseSqsMessage(messageBody)).toThrow(UnprocessableMessageError)
  })
})
