import Joi from 'joi'
import { createCloudEventSchema } from '../../common/cloud-event.js'
import { createEventDocumentSchema, createEventDocumentsArraySchema } from '../../common/event-document.js'

const metadataPayloadSchema = Joi.object({
  sbi: Joi.string().optional().label('Single Business Identifier'),
  blobReference: Joi.string().optional().label('Blob Reference'),
  correlationId: Joi.string().uuid().optional().label('Event Correlation ID')
}).required().label('File Metadata Event Payload')

const fileMetadataCloudEventSchema = createCloudEventSchema(metadataPayloadSchema)
  .label('File Metadata Cloud Event Schema')

const eventSchema = createEventDocumentSchema(fileMetadataCloudEventSchema)
  .label('File Metadata Event Schema')

const eventsArraySchema = createEventDocumentsArraySchema(eventSchema)
  .label('File Metadata Events Array Schema')

export {
  eventSchema,
  eventsArraySchema
}
