import { health } from './health/index.js'
import comms from '../routes/comms/id.js'
import commsReference from '../routes/comms/reference.js'

const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      await server.register([health])
      await server.route(comms)
      await server.route(commsReference)
    }
  }
}

export { router }
