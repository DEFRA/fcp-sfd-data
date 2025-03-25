const getCommsEventById = async (_, { id }, { dataSources }) => {
  return dataSources.commsEvent.getCommsEventById(id)
}
export default getCommsEventById
