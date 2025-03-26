const getMetadata = async (_, { key, value }) => {
  return {
    getMetadata: {
      test: 'getMetadata'
    }
  }
}

export {
  getMetadata
}
