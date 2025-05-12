import Boom from '@hapi/boom'
import Joi from 'joi'

import { getCommsEventByReference } from '../../repos/comms/comms-message.js'
import { NotFoundError } from '../../errors/not-found-error.js'

export default [{
  method: 'GET',
  path: '/api/v1/comms/events/reference/{reference}',
  options: {
    auth: false,
    validate: {
      params: Joi.object({
        reference: Joi.string().required()
      })
    }
  },
  handler: async (request, h) => {
    try {
      const { reference } = request.params
      const data = await getCommsEventByReference(reference)
      return h.response({ data })
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw Boom.notFound(err)
      }
      throw Boom.internal(err)
    }
  }
}]
