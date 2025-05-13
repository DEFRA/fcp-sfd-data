import Joi from 'joi'
import { eventsArraySchema } from '../../common/event.js'

const successModel = Joi.object({
  data: eventsArraySchema
}).label('Get By Reference')

export { successModel }
