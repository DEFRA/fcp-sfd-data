import { getAllCommsEvents, getCommsEventById } from '../../repos/comms-message.js'

export class CommsDataSource {
  constructor (request) {
    this.request = request
  }

  async getAllCommsEvents () {
    return getAllCommsEvents()
  }

  async getCommsEventById (id) {
    return getCommsEventById(id)
  }
}
