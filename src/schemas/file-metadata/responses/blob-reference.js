import Joi from 'joi'
import { eventSchema } from './event.js'

const successModel = Joi.object({
  data: eventSchema
}).label('Get File Metadata Events By Blob Reference')

export { successModel }
