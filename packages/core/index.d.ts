import { IncomingMessage, ServerResponse } from 'http'

/**
 * Send body of response
 */
type Send<T> = (body: T) => void

/**
 * Data passed from the prev middleware
 */
type Info<T = any> = T

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
  res: NextApiResponse,
  info: Info
) => Promise<void> | any

declare function middy(apiHandler: ApiHandler): {
  (req: NextApiRequest, res: NextApiResponse): Promise<any> | any
  use(middlewares: MiddlewareObj | MiddlewareObj[]): any
  applyMiddleware(middleware?: MiddlewareObj): any
  before(beforeMiddleware: MiddlewareFn): any
  after(afterMiddleware: MiddlewareFn): any
  onError(onErrorMiddleware: MiddlewareFn): any
  __middlewares: {
    before: MiddlewareFn[]
    after: MiddlewareFn[]
    onError: MiddlewareFn[]
  }
}

export declare type MiddlewareFn<R = any> = (
  req: NextApiRequest,
  res: NextApiResponse,
  info: Info
) => Promise<R> | R
export interface MiddlewareObj {
  before?: MiddlewareFn
  after?: MiddlewareFn
  onError?: MiddlewareFn
}

export default middy
