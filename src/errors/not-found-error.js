export class NotFoundError extends Error {
  constructor (id) {
    super(`No document found with id: ${id}`)
    this.name = 'NotFoundError'
  }
}
