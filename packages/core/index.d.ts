import { IncomingMessage, ServerResponse } from 'http'

/**
 * Send body of response
 */
type Send<T> = (body: T) => void

export declare type Env = {
  [key: string]: string
}

/**
 * Next `API` route request
 */
export interface NextApiRequest extends IncomingMessage {
  /**
   * Object of `query` values from url
   */
  query: Partial<{
    [key: string]: string | string[]
  }>
  /**
   * Object of `cookies` from header
   */
  cookies: Partial<{
    [key: string]: string
  }>

  body: any
  env: Env
  preview?: boolean
}

/**
 * Next `API` route response
 */
export type NextApiResponse<T = any> = ServerResponse & {
  /**
   * Send data `any` data in response
   */
  send: Send<T>
  /**
   * Send data `json` data in response
   */
  json: Send<T>
  status: (statusCode: number) => NextApiResponse<T>
  redirect(url: string): NextApiResponse<T>
  redirect(status: number, url: string): NextApiResponse<T>

  /**
   * Set preview data for Next.js' prerender mode
   */
  setPreviewData: (
    data: object | string,
    options?: {
      /**
       * Specifies the number (in seconds) for the preview session to last for.
       * The given number will be converted to an integer by rounding down.
       * By default, no maximum age is set and the preview session finishes
       * when the client shuts down (browser is closed).
       */
      maxAge?: number
    }
  ) => NextApiResponse<T>
  clearPreviewData: () => NextApiResponse<T>

  /**
   * @deprecated `unstable_revalidate` has been renamed to `revalidate`
   */
  unstable_revalidate: () => void

  revalidate: (
    urlPath: string,
    opts?: {
      unstable_onlyGenerated?: boolean
    }
  ) => Promise<void>
}

export type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<any> | any

declare type MiddyfiedHandler<R = any> = {
  use: UseFn<R>
  before: MiddlewareFn<R>
  after: MiddlewareFn<R>
  onError: MiddlewareFn<R>
}

declare type UseFn<R> = (
  middlewares: MiddlewareObj<R> | MiddlewareObj<R>[]
) => MiddyfiedHandler<R>

declare function middy<R>(apiHandler: ApiHandler): MiddyfiedHandler<R>

export declare type MiddlewareFn<R = any> = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<R> | R

declare type OnErrorFn<R> = (
  req: NextApiRequest,
  res: NextApiResponse,
  error: any
) => Promise<R> | R

export interface MiddlewareObj<R> {
  before?: MiddlewareFn
  after?: MiddlewareFn
  onError?: OnErrorFn<R>
}

export default middy
