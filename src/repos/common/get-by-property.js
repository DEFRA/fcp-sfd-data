import { GraphQLError } from 'graphql'
import { StatusCodes } from 'http-status-codes'

import db from '../../data/db.js'

const getByProperty = async (collection, key, value) => {
  const values = Array.isArray(value) ? value.map(String) : [String(value)]
  const query = { [key]: { $in: values } }
  const documents = await db.collection(collection).find(query).toArray()

  if (!documents.length) {
    throw new GraphQLError('No matching document found', {
      extensions: { code: StatusCodes.NOT_FOUND }
    })
  }

  return documents.map((document) => ({ correlationId: document._id, events: document.events }))
}

export default getByProperty
