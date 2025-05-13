import Boom from '@hapi/boom'
import Joi from 'joi'

import { NotFoundError } from '../../errors/not-found-error.js'
import { httpStatusResult } from '../../schemas/common/response.js'
import { successModel } from '../../schemas/comms/responses/reference.js'
import { failAction } from '../../api/common/helpers/fail-action.js'
import { getCommsEventByReference } from '../../repos/comms/comms-message.js'

export default [{
  method: 'GET',
  path: '/api/v1/comms/events/reference/{reference}',
  options: {
    description: 'Returns an array of commsEvents by reference',
    auth: false,
    tags: ['api', 'comms'],
    plugins: { 'hapi-swagger': httpStatusResult(successModel) },
    validate: {
      params: Joi.object({
        reference: Joi.string().required()
      }),
      failAction
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
  }
}]
