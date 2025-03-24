const getCommsEventByProperty = async (_, { key, value }, { dataSources }) => {
  return dataSources.commsDB.getCommsEventByProperty(key, value)
}

export default getCommsEventByProperty
