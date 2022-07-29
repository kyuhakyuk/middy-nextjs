export type Extensions = {
  argumentName?: string
  code: string
}

export type ErrorResponse = {
  message: string
  extensions: Extensions
}

export declare class MiddyNextjsError extends Error {
  statusCode: number
  constructor(message: string)
  serializeErrors(): Array<ErrorResponse>
}

export declare class UnauthenticatedError extends MiddyNextjsError {
  name: string
  statusCode: number
  constructor(message: string)
  serializeErrors(): Array<ErrorResponse>
}

export declare class NotFoundError extends MiddyNextjsError {
  name: string
  statusCode: number
  constructor(message: string)
  serializeErrors(): Array<ErrorResponse>
}

export declare class InternalServerError extends MiddyNextjsError {
  name: string
  statusCode: number
  constructor(message: string)
  serializeErrors(): Array<ErrorResponse>
}

export declare class ForbiddenError extends MiddyNextjsError {
  name: string
  statusCode: number
  constructor(message: string)
  serializeErrors(): Array<ErrorResponse>
}

export declare class BadRequestError extends MiddyNextjsError {
  name: string
  statusCode: number
  constructor(message: string)
  serializeErrors(): Array<ErrorResponse>
}

export declare class ValidationError extends MiddyNextjsError {
  name: string
  statusCode: number
  extensions: Array<{ message: string; argumentName: string }>
  constructor(extensions: Array<{ message: string; argumentName: string }>)
  serializeErrors(): Array<ErrorResponse>
}
