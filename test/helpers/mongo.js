import db from '../../src/data/db.js'

const insertMockEventToDb = async (collection, id, mockEvent) => {
  await db.collection(collection).insertOne({
    _id: id,
    events: [mockEvent]
  })
}

const clearCollection = async (collection) => {
  await db.collection(collection).deleteMany({})
}

export {
  insertMockEventToDb,
  clearCollection
}
