import Boom from '@hapi/boom'
import Joi from 'joi'

import { NotFoundError } from '../../../errors/not-found-error.js'
import { httpStatusResult } from '../../../schemas/common/response.js'
import { successModel } from '../../../schemas/comms/responses/id.js'
import { failAction } from '../../../api/common/helpers/fail-action.js'
import { getCommsEventById } from '../../../repos/comms/comms-message.js'

export default [{
  method: 'GET',
  path: '/api/v1/comms/events/id/{id}',
  options: {
    description: 'Returns a single commsEvent by id',
    auth: false,
    tags: ['api', 'comms'],
    plugins: { 'hapi-swagger': httpStatusResult(successModel) },
    validate: {
      params: Joi.object({
        id: Joi.string().guid({ version: 'uuidv4' }).required()
      }),
      failAction
    }
  },
  handler: async (request, h) => {
    try {
      const { id } = request.params
      const data = await getCommsEventById(id)
      return h.response({ data })
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw Boom.notFound(err)
      }
      throw Boom.internal(err)
    }
  }
}]
