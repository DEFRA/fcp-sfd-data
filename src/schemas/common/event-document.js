import Joi from 'joi'

const createEventDocumentSchema = (cloudEventSchema) => {
  return Joi.object({
    correlationId: Joi.string().guid({ version: 'uuidv4' }).required().label('Correlation ID'),
    events: Joi.array().items(cloudEventSchema).required().label('Events')
  }).label('Event Document')
}

const createEventDocumentsArraySchema = (eventDocumentSchema) => {
  return Joi.array().items(eventDocumentSchema).label('Event Documents Array')
}

export {
  createEventDocumentSchema,
  createEventDocumentsArraySchema
}
