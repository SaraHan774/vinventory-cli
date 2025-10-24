/**
 * Custom HTTP Error Classes
 *
 * Provides type-safe error handling with proper HTTP status codes.
 * These errors can be caught by the global error handler and
 * automatically converted to appropriate HTTP responses.
 */

/**
 * Base HTTP Error class
 * Extends the native Error class with HTTP status code support
 */
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errorCode?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request Error
 * Used when the request cannot be processed due to client error
 */
export class BadRequestError extends HttpError {
  constructor(message: string = '잘못된 요청입니다.') {
    super(400, message, 'BAD_REQUEST');
  }
}

/**
 * 404 Not Found Error
 * Used when the requested resource doesn't exist
 */
export class NotFoundError extends HttpError {
  constructor(message: string = '요청한 리소스를 찾을 수 없습니다.') {
    super(404, message, 'NOT_FOUND');
  }
}

/**
 * 400 Validation Error
 * Used when request data fails validation
 */
export class ValidationError extends HttpError {
  constructor(
    message: string = '요청 데이터 검증에 실패했습니다.',
    public validationErrors?: any
  ) {
    super(400, message, 'VALIDATION_ERROR');
  }
}

/**
 * 409 Conflict Error
 * Used when the request conflicts with current state
 */
export class ConflictError extends HttpError {
  constructor(message: string = '요청이 현재 상태와 충돌합니다.') {
    super(409, message, 'CONFLICT');
  }
}

/**
 * 500 Internal Server Error
 * Used for unexpected server errors
 */
export class InternalServerError extends HttpError {
  constructor(message: string = '서버 내부 오류가 발생했습니다.') {
    super(500, message, 'INTERNAL_ERROR');
  }
}
