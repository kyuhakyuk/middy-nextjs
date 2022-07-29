const {
  BadRequestError,
  UnauthenticatedError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} = require('../index.js')
const test = require('ava')

test('should throw "BadRequestError"', async t => {
  let error = t.throws(() => {
    throw new BadRequestError('BadRequestError')
  })

  t.is(error.name, 'BadRequestError')
  t.is(error.message, 'BadRequestError')
})

test('should throw "ForbiddenError"', async t => {
  let error = t.throws(() => {
    throw new ForbiddenError('ForbiddenError')
  })

  t.is(error.name, 'ForbiddenError')
  t.is(error.message, 'ForbiddenError')
})

test('should throw "UnauthenticatedError"', async t => {
  let error = t
    .throws(() => {
      throw new UnauthenticatedError('UnauthenticatedError')
    })
    .serializeErrors()[0]

  t.is(error.extensions.code, 'UNAUTHENTICATED')
  t.is(error.message, 'UnauthenticatedError')
})

test('should throw "NotFoundError"', async t => {
  let error = t.throws(() => {
    throw new NotFoundError('NotFoundError')
  })

  t.is(error.name, 'NotFoundError')
  t.is(error.message, 'NotFoundError')
})

test('should throw "InternalServerError"', async t => {
  let error = t.throws(() => {
    throw new InternalServerError('InternalServerError')
  })

  t.is(error.name, 'InternalServerError')
  t.is(error.message, 'InternalServerError')
})

test('should throw "ValidationError"', async t => {
  let error = t
    .throws(() => {
      throw new ValidationError([
        {
          message: 'number must be a number',
          argumentName: 'number',
        },
      ])
    })
    .serializeErrors()[0]

  t.is(
    error.message,
    'Validation error(s) present. See extensions for more details.'
  )
  t.is(error.extensions.code, 'VALIDATION_FAILED')
})
