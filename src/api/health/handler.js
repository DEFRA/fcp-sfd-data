import { StatusCodes } from 'http-status-codes'

const healthHandler = {
  handler: (_request, h) =>
    h.response({ message: 'success' }).code(StatusCodes.OK)
}

export { healthHandler }
