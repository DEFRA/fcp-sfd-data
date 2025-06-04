import { health } from './health/index.js'
import comms from '../api/v1/comms/id.js'
import commsReference from '../api/v1/comms/reference.js'
import metadata from '../api/v1/metadata/id.js'
import metadataBlobReference from '../api/v1/metadata/blob-reference.js'

const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      await server.register([health])
      await server.route(comms)
      await server.route(commsReference)
      await server.route(metadata)
      await server.route(metadataBlobReference)
    }
  }
}

export { router }
