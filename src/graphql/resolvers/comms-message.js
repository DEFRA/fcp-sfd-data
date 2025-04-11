const getCommsEventById = async (_, { id }, { dataSources }) => {
  return dataSources.commsEvent.getCommsEventById(id)
}

const getCommsEventByProperty = async (_, { key, value }, { dataSources }) => {
  return dataSources.commsEvent.getCommsEventByProperty(key, value)
}

export {
  getCommsEventById,
  getCommsEventByProperty
}
