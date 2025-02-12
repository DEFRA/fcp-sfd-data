import { findAllExampleData } from '~/src/api/example/helpers/find-all-example-data.js'
import { StatusCodes } from 'http-status-codes'

const exampleFindAllController = {
  handler: async (request, h) => {
    const entities = await findAllExampleData(request.db)

    return h.response({ message: 'success', entities }).code(StatusCodes.OK)
  }
}

export { exampleFindAllController }
