import db from '../../data/db.js'
import { NotFoundError } from '../../errors/not-found-error.js'

const getById = async (collection, id) => {
  const document = await db.collection(collection).findOne({ _id: id })

  if (!document) {
    throw new NotFoundError(`No document found with id: ${id}`)
  }

  return { correlationId: document._id, events: document.events }
}

export default getById
