import { GraphQLError } from 'graphql'
import { StatusCodes } from 'http-status-codes'

import db from '../../data/db.js'

const getById = async (collection, id) => {
  const document = await db.collection(collection).findOne({ _id: id })

  if (!document) {
    throw new GraphQLError('No document found', {
      extensions: { code: StatusCodes.NOT_FOUND }
    })
  }

  return { correlationId: document._id, events: document.events }
}

export default getById
