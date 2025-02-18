import { healthHandler } from './handler.js'

const health = {
  plugin: {
    name: 'health',
    register: (server) => {
      server.route({
        method: 'GET',
        path: '/health',
        ...healthHandler
      })
    }
  }
}

export { health }
