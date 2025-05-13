import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const httpStatusResult = (successModel) => {
  return {
    responses: {
      [StatusCodes.OK]: {
        description: 'Success',
        schema: successModel
      },
      [StatusCodes.BAD_REQUEST]: {
        description: 'Bad Request',
        schema: Joi.object({
          statusCode: Joi.number().allow(StatusCodes.BAD_REQUEST),
          error: Joi.string(),
          message: Joi.string(),
          validation: Joi.object({
            source: Joi.string(),
            keys: Joi.array().items(Joi.string())
          })
        }).label('Bad Request')
      },
      [StatusCodes.NOT_FOUND]: {
        description: 'Not found',
        schema: Joi.object({
          statusCode: Joi.number().allow(StatusCodes.NOT_FOUND),
          error: Joi.string(),
          message: Joi.string()
        }).label('Not Found')
      },
      [StatusCodes.INTERNAL_SERVER_ERROR]: {
        description: 'Internal Server Error',
        schema: Joi.object({
          statusCode: Joi.number().allow(StatusCodes.INTERNAL_SERVER_ERROR),
          error: Joi.string(),
          message: Joi.string()
        }).label('Internal Server Error')
      }
    }
  }
}

export { httpStatusResult }
