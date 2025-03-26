import { getCommsEventById, getByProperty } from '../../repos/comms-message.js'

export class CommsDataSource {
  constructor (request) {
    this.request = request
  }

  async getByProperty () {
    return getByProperty()
  }

  async getCommsEventById (id) {
    return getCommsEventById(id)
  }
}
