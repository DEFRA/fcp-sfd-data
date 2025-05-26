import Joi from 'joi'
import { eventsArraySchema } from './event.js'

const successModel = Joi.object({
  data: eventsArraySchema
}).label('Get Comms Events By Reference')

export { successModel }
