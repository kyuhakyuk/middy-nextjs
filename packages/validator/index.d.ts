import joi from 'joi'
import { MiddlewareFn } from '@middy-nextjs/core'

declare type Options = {
  inputSchema?: joi.ObjectSchema<any>
}

declare function validatorMiddleware(options?: Options): {
  before: MiddlewareFn
}

export default validatorMiddleware
