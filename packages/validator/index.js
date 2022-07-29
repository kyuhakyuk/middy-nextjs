const { ValidationError } = require('@middy-nextjs/error')

function validatorMiddleware(options = {}) {
  const { inputSchema } = options

  const validatorMiddlewareBefore = req => {
    const { error } = inputSchema.validate(req.body)

    if (error) {
      throw new ValidationError(errorParser(error))
    }
  }

  return {
    before: inputSchema ? validatorMiddlewareBefore : undefined,
  }
}

function errorParser(error) {
  return error.details.map(({ message, path }) => ({
    message,
    argumentName: path.join('.'),
  }))
}

module.exports = validatorMiddleware
