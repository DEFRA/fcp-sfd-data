import Joi from 'joi'

const httpStatusResult = (successModel) => {
  return {
    responses: {
      200: {
        description: 'Success',
        schema: successModel
      },
      400: {
        description: 'Bad Request',
        schema: Joi.object({
          statusCode: Joi.number().allow(400),
          error: Joi.string(),
          message: Joi.string()
        }).label('Bad Request')
      },
      404: {
        description: 'Not found',
        schema: Joi.object({
          statusCode: Joi.number().allow(404),
          error: Joi.string(),
          message: Joi.string()
        }).label('Not Found')
      },
      500: {
        description: 'Internal Server Error',
        schema: Joi.object({
          statusCode: Joi.number().allow(500),
          error: Joi.string(),
          message: Joi.string()
        }).label('Internal Server Error')
      }
    }
  }
}

export { httpStatusResult }
