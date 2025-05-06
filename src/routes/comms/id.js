import { getCommsEventById } from '../../repos/comms-message.js'
import Boom from '@hapi/boom'
import Joi from 'joi'

export default [{
  method: 'GET',
  path: '/api/v1/comms/events/{eventId}', // could this path be misleading? looks like the comms service?
  options: {
    auth: false,
    validate: {
      params: Joi.object({
        eventId: Joi.string().guid({ version: 'uuidv4' }).required()
      })
    }
  },
  handler: async (request, h) => {
    try {
      const { eventId } = request.params
      const data = await getCommsEventById(eventId)
      return h.response({ data })
    } catch (err) {
      if (err.message.includes('No document found')) {
        throw Boom.notFound(err)
      }
      throw Boom.internal(err)
    }
  }
}]
