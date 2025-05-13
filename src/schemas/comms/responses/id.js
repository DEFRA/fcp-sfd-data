import Joi from 'joi'
import { eventSchema } from '../../common/event.js'

const successModel = Joi.object({
  data: eventSchema
}).label('Get By ID Response')

export { successModel }
