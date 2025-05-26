import Joi from 'joi'
import { eventSchema } from './event.js'

const successModel = Joi.object({
  data: eventSchema
}).label('Get File Metadata By ID')

export { successModel }
