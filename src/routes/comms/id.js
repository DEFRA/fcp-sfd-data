import { getCommsEventById } from '../../repos/comms-message.js'

export default {
  method: 'GET',
  path: '/v1/comms/events/{eventId}',
  options: {
    auth: false
  },
  handler: async (request, h) => {
    try {
      const { id } = request.params
      const data = await getCommsEventById(id)
      return { data }
    } catch (err) {
      console.error(err)
    }
  }
}
