import Joi from 'joi'

const metadataPayloadSchema = Joi.object({
  sbi: Joi.string().optional().label('Single Business Identifier'),
  blobReference: Joi.string().optional().label('Blob Reference'),
  correlationId: Joi.string().uuid().optional().label('Event Correlation ID')
}).required().label('Event Payload')

const cloudEventSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required().label('Event ID'),
  source: Joi.string().required().label('Source'),
  specversion: Joi.string().required().label('Spec Version'),
  type: Joi.string().required().label('Event Type'),
  datacontenttype: Joi.string().required().label('Content Type'),
  time: Joi.date().required().label('Timestamp'),
  data: metadataPayloadSchema
}).label('Cloud Event')

const eventSchema = Joi.object({
  correlationId: Joi.string().guid({ version: 'uuidv4' }).required().label('Correlation ID'),
  events: Joi.array().items(cloudEventSchema).required().label('Events')
}).label('Event Document')

const eventsArraySchema = Joi.array().items(eventSchema).label('Events Document')

export { eventSchema, eventsArraySchema }
