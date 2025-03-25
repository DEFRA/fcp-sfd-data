const getCommsEventById = async (_, { id }, { dataSources }) => {
  return dataSources.commsDB.getCommsEventById(id)
}

export default getCommsEventById
