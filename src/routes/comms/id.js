import { getCommsEventById } from '../../repos/comms/comms-message.js'
import Boom from '@hapi/boom'
import Joi from 'joi'

export default [{
  method: 'GET',
  path: '/api/v1/comms/events/id/{id}',
  options: {
    auth: false,
    validate: {
      params: Joi.object({
        id: Joi.string().guid({ version: 'uuidv4' }).required()
      })
    }
  },
  handler: async (request, h) => {
    try {
      const { id } = request.params
      const data = await getCommsEventById(id)
      // if (data === null) {
      //   throw Boom.notFound(err)
      return h.response({ data })
    } catch (err) {
      if (err.message.includes('No document found')) {
        throw Boom.notFound(err)
      }
      throw Boom.internal(err)
    }
  }
}]
