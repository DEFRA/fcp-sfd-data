import { health } from './health/index.js'
import comms from '../routes/comms/id.js'

const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      await server.register([health])
      await server.route(comms)
    }
  }
}

export { router }
