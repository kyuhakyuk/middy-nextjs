const test = require('ava')
const middy = require('../../core')
const joi = require('joi')
const validator = require('../index.js')

test('It should validate an incoming object', async t => {
  const handler = middy(() => {})

  const inputSchema = joi.object({
    string: joi.string().required(),
    boolean: joi.boolean().required(),
    integer: joi.number().integer().required(),
    number: joi.number().required(),
  })

  handler.use(
    validator({
      inputSchema,
    })
  )

  // invokes the handler
  const body = {
    string: JSON.stringify({ foo: 'bar' }),
    boolean: true,
    integer: 0,
    number: 0.1,
  }

  await handler({ body }, {})

  t.is('', '')
})

test('It should handle invalid schema as a ValidationError', async t => {
  const handler = middy(() => {})

  const inputSchema = joi.object({
    string: joi.string().required(),
    boolean: joi.boolean().required(),
    integer: joi.number().integer().required(),
    number: joi.number().required().messages({
      'number.base': 'number must be a number',
    }),
  })

  handler.use(
    validator({
      inputSchema,
    })
  )

  // invokes the handler
  const body = {
    string: JSON.stringify({ foo: 'bar' }),
    boolean: true,
    integer: 0,
    number: 'not a number',
  }

  try {
    await handler({ body }, {})
  } catch (error) {
    const errors = error.serializeErrors()

    t.is(
      errors[0].message,
      'Validation error(s) present. See extensions for more details.'
    )
    t.is(errors[0].extensions.code, 'VALIDATION_FAILED')
    t.is(errors[0].extensions.message, 'number must be a number')
    t.is(errors[0].extensions.argumentName, 'input.number')
  }
})

test('It should handle invalid schema as a ValidationError with onError middleware', async t => {
  const handler = middy(() => {})

  const inputSchema = joi.object({
    string: joi.string().required(),
    boolean: joi.boolean().required(),
    integer: joi.number().integer().required(),
    number: joi.number().required().messages({
      'number.base': 'number must be a number',
    }),
  })

  handler.use(
    validator({
      inputSchema,
    })
  )

  // invokes the handler
  const body = {
    string: JSON.stringify({ foo: 'bar' }),
    boolean: true,
    integer: 0,
    number: 'not a number',
  }

  await handler({ body }, {}).onError(e => {
    console.log(e)
  })

  t.is('', '')
  // try {

  // } catch (error) {
  //   const errors = error.serializeErrors()

  //   t.is(
  //     errors[0].message,
  //     'Validation error(s) present. See extensions for more details.'
  //   )
  //   t.is(errors[0].extensions.code, 'VALIDATION_FAILED')
  //   t.is(errors[0].extensions.message, 'number must be a number')
  //   t.is(errors[0].extensions.argumentName, 'input.number')
  // }
})
