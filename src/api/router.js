import { health } from './health/index.js'

const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      await server.register([health])
    }
  }
}

export { router }
