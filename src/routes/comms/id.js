import { getCommsEventById } from '../../repos/comms-message.js'

export default [{
  method: 'GET',
  path: '/api/v1/comms/events/{eventId}',
  options: {
    auth: false
  },
  handler: async (request, h) => {
    try {
      const { eventId } = request.params
      const data = await getCommsEventById(eventId)
      return h.response({ data })
    } catch (err) {
      console.error(err)
      return h.response('error').code(500)
    }
  }
}]
