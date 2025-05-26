import Joi from 'joi'
import { createCloudEventSchema } from '../../common/cloud-event.js'
import { createEventDocumentSchema, createEventDocumentsArraySchema } from '../../common/event-document.js'

const commsEventPayloadSchema = Joi.object({
  correlationId: Joi.string().uuid().optional().label('Event Correlation ID'),
  crn: Joi.string().optional().label('Customer Reference Number'),
  sbi: Joi.string().optional().label('Single Business Identifier'),
  sourceSystem: Joi.string().optional().label('Source System'),
  notifyTemplateId: Joi.string().uuid().optional().label('Notify Template ID'),
  commsType: Joi.string().optional().label('Communication Type'),
  recipient: Joi.string().email().label('Recipient Email'),
  personalisation: Joi.object({}).optional().label('Personalisation'),
  reference: Joi.string().optional().label('Reference'),
  statusDetails: Joi.object({}).optional().label('Status Details'),
  oneClickUnsubscribeUrl: Joi.string().uri().optional().label('Unsubscribe URL'),
  emailReplyToId: Joi.string().uuid().optional().label('Email Reply To ID')
}).required().label('Comms Event Payload')

const commsCloudEventSchema = createCloudEventSchema(commsEventPayloadSchema)
  .label('Comms Notification Cloud Event Schema')

const eventSchema = createEventDocumentSchema(commsCloudEventSchema)
  .label('Comms Notification Event Schema')

const eventsArraySchema = createEventDocumentsArraySchema(eventSchema)
  .label('Comms Notification Events Array Schema')

export {
  eventSchema,
  eventsArraySchema
}
