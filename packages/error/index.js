class MiddyNextjsError extends Error {
  statusCode

  constructor(message) {
    super(message)

    Object.setPrototypeOf(this, MiddyNextjsError.prototype)
  }

  serializeErrors() {}
}

class UnauthenticatedError extends MiddyNextjsError {
  name = 'UnauthenticatedError'
  statusCode = 401

  constructor(message = 'You are not authenticated.') {
    super(message)

    Object.setPrototypeOf(this, UnauthenticatedError.prototype)
  }

  serializeErrors() {
    return [{ message: this.message, extensions: { code: 'UNAUTHENTICATED' } }]
  }
}

class NotFoundError extends MiddyNextjsError {
  name = 'NotFoundError'
  statusCode = 404

  constructor(message = 'Not Found') {
    super(message)

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors() {
    return [{ message: this.message, extensions: { code: 'NOT_FOUND' } }]
  }
}

class InternalServerError extends MiddyNextjsError {
  name = 'InternalServerError'
  statusCode = 500

  constructor(
    message = 'Oops, something went wrong! Our engineers have been alerted and will fix this asap.'
  ) {
    super(message)

    Object.setPrototypeOf(this, InternalServerError.prototype)
  }

  serializeErrors() {
    return [
      { message: this.message, extensions: { code: 'INTERNAL_SERVER_ERROR' } },
    ]
  }
}

class ForbiddenError extends MiddyNextjsError {
  name = 'ForbiddenError'
  statusCode = 403

  constructor(message = 'You are not authorized.') {
    super(message)

    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }

  serializeErrors() {
    return [{ message: this.message, extensions: { code: 'FORBIDDEN' } }]
  }
}

class BadRequestError extends MiddyNextjsError {
  name = 'BadRequestError'
  statusCode = 400

  constructor(message) {
    super(message)

    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors() {
    return [{ message: this.message, extensions: { code: 'BAD_REQUEST' } }]
  }
}

class ValidationError extends MiddyNextjsError {
  name = 'ValidationError'
  statusCode = 400
  extensions = []

  constructor(extensions = []) {
    super('Validation error(s) present. See extensions for more details.')
    this.extensions = extensions
    Object.setPrototypeOf(this, ValidationError.prototype)
  }

  serializeErrors() {
    return this.extensions.map(ext => ({
      message: this.message,
      extensions: {
        code: 'VALIDATION_FAILED',
        message: ext.message,
        argumentName: ext.argumentName,
      },
    }))
  }
}

module.exports = {
  ValidationError,
  BadRequestError,
  MiddyNextjsError,
  UnauthenticatedError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
}
