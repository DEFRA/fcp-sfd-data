import { getCommsEventById, getByProperty } from '../../repos/comms-message.js'
import enumMap from '../schema/comms-message/enum-map.js'

export class CommsDataSource {
  constructor (request) {
    this.request = request
  }

  async getCommsEventById (id) {
    return getCommsEventById(id)
  }

  async getCommsEventByProperty (key, value) {
    const mappedKey = enumMap[key] ? `events.${enumMap[key]}` : key
    return getByProperty(mappedKey, value)
  }
}
