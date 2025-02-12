import { healthController } from '~/src/api/health/controller.js'

const health = {
  plugin: {
    name: 'health',
    register: (server) => {
      server.route({
        method: 'GET',
        path: '/health',
        ...healthController
      })
    }
  }
}

export { health }
