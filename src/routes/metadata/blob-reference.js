import Boom from '@hapi/boom'
import Joi from 'joi'

import { NotFoundError } from '../../errors/not-found-error.js'
import { httpStatusResult } from '../../schemas/common/response.js'
import { successModel } from '../../schemas/file-metadata/responses/blob-reference.js'
import { failAction } from '../../api/common/helpers/fail-action.js'
import { getMetadataByBlobReference } from '../../repos/metadata/file-metadata.js'

export default [{
  method: 'GET',
  path: '/api/v1/metadata/events/blob-reference/{blobReference}',
  options: {
    description: 'Returns an array of metadata events by blobReference',
    auth: false,
    tags: ['api', 'metadata'],
    plugins: { 'hapi-swagger': httpStatusResult(successModel) },
    validate: {
      params: Joi.object({
        blobReference: Joi.string().required()
      }),
      failAction
    }
  },
  handler: async (request, h) => {
    try {
      const { blobReference } = request.params
      const data = await getMetadataByBlobReference(blobReference)
      return h.response({ data })
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw Boom.notFound(err)
      }
      throw Boom.internal(err)
    }
  }
}]
