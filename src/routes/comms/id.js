import Boom from '@hapi/boom'
import Joi from 'joi'

import { getCommsEventById } from '../../repos/comms/comms-message.js'
import { failAction } from '../../api/common/helpers/fail-action.js'
import { NotFoundError } from '../../errors/not-found-error.js'

// const resultModel = Joi.object({
//   id: Joi.string().guid({ version: 'uuidv4' }).required(),
//   events: Joi.array().items(Joi.object({
//     id: Joi.string().guid({ version: 'uuidv4' }).required(),
//     source: Joi.string().required(),
//     specversion: Joi.string().required(),
//     type: Joi.string().required(),
//     datacontenttype: Joi.string().required(),
//     time: Joi.date().required(),
//     data: Joi.object(
//       {
//         correlationId: Joi.string().uuid().optional(),
//         crn: Joi.string().optional(),
//         sbi: Joi.string().optional(),
//         sourceSystem: Joi.string().optional(),
//         notifyTemplateId: Joi.string().uuid().optional(),
//         commsType: Joi.string().optional(),
//         commsAddresses: Joi.array().items(Joi.string().email()).optional(),
//         personalisation: Joi.object({}).optional(),
//         reference: Joi.string().optional(),
//         statusDetails: Joi.object({}).optional(),
//         oneClickUnsubscribeUrl: Joi.string().uri().optional(),
//         emailReplyToId: Joi.string().uuid().optional()
//       }
//     ).required()
//   })).required()
// }).label('Result')

// const resultHTTPStatus = {
//   status: {
//     200: {
//       description: 'Success',
//       schema: resultModel
//     },
//     400: {
//       description: 'Bad Request'
//     },
//     404: {
//       description: 'Not found'
//     },
//     500: {
//       description: 'Internal Server Error'
//     }
//   }
// }

export default [{
  method: 'GET',
  path: '/api/v1/comms/events/id/{id}',
  options: {
    description: 'Returns a single commsEvent by id',
    auth: false,
    tags: ['api', 'comms'],
    validate: {
      params: Joi.object({
        id: Joi.string().guid({ version: 'uuidv4' }).required()
      }),
      failAction
    }
    // response: { ...resultHTTPStatus }
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
