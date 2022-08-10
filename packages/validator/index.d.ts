import joi from 'joi'
import { MiddlewareObj } from '@middy-nextjs/core'

declare type Options = {
  inputSchema?: joi.ObjectSchema<any>
}

declare function validatorMiddleware(options?: Options): MiddlewareObj<any>

export default validatorMiddleware
