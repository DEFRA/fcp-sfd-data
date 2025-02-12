import { StatusCodes } from 'http-status-codes'

const healthController = {
  handler: (_request, h) =>
    h.response({ message: 'success' }).code(StatusCodes.OK)
}

export { healthController }

