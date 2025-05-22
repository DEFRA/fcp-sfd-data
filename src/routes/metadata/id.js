import Boom from '@hapi/boom'
import Joi from 'joi'

import { NotFoundError } from '../../errors/not-found-error.js'
import { httpStatusResult } from '../../schemas/common/response.js'
import { successModel } from '../../schemas/file-metadata/responses/id.js'
import { failAction } from '../../api/common/helpers/fail-action.js'
import { getMetadataById } from '../../repos/metadata/file-metadata.js'

export default [{
  method: 'GET',
  path: '/api/v1/metadata/events/id/{id}',
  options: {
    description: 'Returns a single metadata event by id',
    auth: false,
    tags: ['api', 'metadata'],
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
      const data = await getMetadataById(id)
      return h.response({ data })
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw Boom.notFound(err)
      }
      throw Boom.internal(err)
    }
  }
}]
