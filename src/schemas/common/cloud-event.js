import Joi from 'joi'

const createCloudEventSchema = (dataSchema) => {
  return Joi.object({
    id: Joi.string().guid({ version: 'uuidv4' }).required().label('Event ID'),
    source: Joi.string().required().label('Source'),
    specversion: Joi.string().required().label('Spec Version'),
    type: Joi.string().required().label('Event Type'),
    datacontenttype: Joi.string().required().label('Content Type'),
    time: Joi.date().required().label('Timestamp'),
    data: dataSchema
  }).label('Cloud Event')
}

export { createCloudEventSchema }
