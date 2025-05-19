import { health } from './health/index.js'
import comms from '../routes/comms/id.js'
import commsReference from '../routes/comms/reference.js'
import metadata from '../routes/metadata/id.js'

const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      await server.register([health])
      await server.route(comms)
      await server.route(commsReference)
      await server.route(metadata)
    }
  }
}

export { router }
