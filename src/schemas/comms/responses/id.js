import Joi from 'joi'
import { eventSchema } from './event.js'

const successModel = Joi.object({
  data: eventSchema
}).label('Get Comms Event By ID')

export { successModel }
