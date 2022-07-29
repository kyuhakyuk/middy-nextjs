function middy(apiHandler) {
  const beforeMiddlewares = []
  const afterMiddlewares = []
  const onErrorMiddlewares = []

  function handler(req, res) {
    return execute(
      { req, res },
      beforeMiddlewares,
      apiHandler,
      afterMiddlewares,
      onErrorMiddlewares
    )
  }

  handler.use = function (middlewares) {
    if (Array.isArray(middlewares)) {
      for (const middleware of middlewares) {
        handler.applyMiddleware(middleware)
      }

      return handler
    }

    return handler.applyMiddleware(middlewares)
  }

  handler.applyMiddleware = function (middleware = {}) {
    const { before, after, onError } = middleware

    if (!before && !after && !onError) {
      throw new Error(
        'Middleware must be an object containing at least one key among "before", "after", "onError"'
      )
    }

    if (before) handler.before(before)
    if (after) handler.after(after)
    if (onError) handler.onError(onError)

    return handler
  }

  // Inline Middlewares
  handler.before = function (beforeMiddleware) {
    beforeMiddlewares.push(beforeMiddleware)
    return handler
  }
  handler.after = function (afterMiddleware) {
    afterMiddlewares.unshift(afterMiddleware)
    return handler
  }
  handler.onError = function (onErrorMiddleware) {
    onErrorMiddlewares.push(onErrorMiddleware)
    return handler
  }

  handler.__middlewares = {
    before: beforeMiddlewares,
    after: afterMiddlewares,
    onError: onErrorMiddlewares,
  }

  return handler
}

async function execute(
  context,
  beforeMiddlewares,
  apiHandler,
  afterMiddlewares,
  onErrorMiddlewares
) {
  try {
    await runMiddlewares(context, beforeMiddlewares)
    context.info = await apiHandler(context.req, context.res, context.info)
    await runMiddlewares(context, afterMiddlewares)
  } catch (e) {
    context.error = e

    if (onErrorMiddlewares.length === 0) {
      throw e
    }

    try {
      await runMiddlewares(context, onErrorMiddlewares)
    } catch (e) {
      throw e
    }
  }
}

async function runMiddlewares({ req, res, info = {} }, middlewares) {
  for (const middleware of middlewares) {
    info = await middleware?.(req, res)
  }
}

module.exports = middy
