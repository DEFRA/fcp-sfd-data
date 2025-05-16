import Joi from 'joi'

const eventPayloadSchema = Joi.object({
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
}).required().label('Event Payload')

const cloudEventSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required().label('Event ID'),
  source: Joi.string().required().label('Source'),
  specversion: Joi.string().required().label('Spec Version'),
  type: Joi.string().required().label('Event Type'),
  datacontenttype: Joi.string().required().label('Content Type'),
  time: Joi.date().required().label('Timestamp'),
  data: eventPayloadSchema
}).label('Cloud Event')

const eventSchema = Joi.object({
  correlationId: Joi.string().guid({ version: 'uuidv4' }).required().label('Correlation ID'),
  events: Joi.array().items(cloudEventSchema).required().label('Events')
}).label('Event Document')

const eventsArraySchema = Joi.array().items(eventSchema).label('Events Document')

export { eventSchema, eventsArraySchema }
