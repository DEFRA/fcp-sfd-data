// Implement methods for:
// - Getting comms event by ID
// - Getting comms events by property

export class CommsDataSource {
  constructor (request) {
    this.request = request
  }

  async getCommsNotifcation () {
    return { test: 'test' }
  }
}
