export const makeApiRequest = async (serverInstance, baseUrl, routeParam) => {
  const requestOptions = {
    method: 'GET',
    url: `${baseUrl}/${routeParam}`,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  return serverInstance.inject(requestOptions)
}
