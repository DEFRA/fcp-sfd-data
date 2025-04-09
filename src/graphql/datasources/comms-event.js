import { getCommsEventById, getCommsEventByProperty } from '../../repos/comms-message.js'
import enumMap from '../schema/comms-message/enum-map.js'

export class CommsEventDataSource {
  constructor (request) {
    this.request = request
  }

  async getCommsEventById (id) {
    return getCommsEventById(id)
  }

  async getCommsEventByProperty (key, value) {
    const mappedKey = `events.${enumMap[key]}`
    return getCommsEventByProperty(mappedKey, value)
  }
}
