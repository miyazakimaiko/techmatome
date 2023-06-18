export class BadRequestError extends Error {
  statusCode: number
  type: string
  constructor(message: string) {
    super(message)
    this.statusCode = 400
    this.type = 'BadRequestError'
  }
}

export class NotFoundError extends Error {
  statusCode: number
  type: string
  constructor(message: string) {
    super(message)
    this.statusCode = 404
    this.type = 'NotFoundError'
  }
}