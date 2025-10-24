/**
 * Response Utility Functions
 *
 * Provides consistent API response formatting across all endpoints.
 * Ensures all responses follow the same structure for success and error cases.
 */

import { Response } from 'express';
import { ApiResponse, ErrorResponse } from '../types/wine';

/**
 * Send a successful JSON response
 *
 * @param res Express response object
 * @param data Response data
 * @param message Optional success message
 * @param statusCode HTTP status code (default: 200)
 */
export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
): void {
  const response: ApiResponse<T> = {
    success: true,
    ...(data !== undefined && { data }),
    ...(message !== undefined && { message })
  };

  res.status(statusCode).json(response);
}

/**
 * Send a created (201) response
 *
 * @param res Express response object
 * @param data Created resource data
 * @param message Optional success message
 */
export function sendCreated<T>(
  res: Response,
  data: T,
  message?: string
): void {
  sendSuccess(res, data, message, 201);
}

/**
 * Send an error response
 *
 * @param res Express response object
 * @param statusCode HTTP status code
 * @param errorCode Error code identifier
 * @param message Error message
 */
export function sendError(
  res: Response,
  statusCode: number,
  errorCode: string,
  message: string
): void {
  const response: ErrorResponse = {
    success: false,
    error: errorCode,
    message
  };

  res.status(statusCode).json(response);
}

/**
 * Send a not found (404) error
 *
 * @param res Express response object
 * @param message Error message
 */
export function sendNotFound(
  res: Response,
  message: string = '요청한 리소스를 찾을 수 없습니다.'
): void {
  sendError(res, 404, 'NOT_FOUND', message);
}

/**
 * Send a validation error (422) response
 *
 * @param res Express response object
 * @param message Error message
 */
export function sendValidationError(
  res: Response,
  message: string = '요청 데이터 검증에 실패했습니다.'
): void {
  sendError(res, 422, 'VALIDATION_ERROR', message);
}

/**
 * Send a bad request (400) error
 *
 * @param res Express response object
 * @param message Error message
 */
export function sendBadRequest(
  res: Response,
  message: string = '잘못된 요청입니다.'
): void {
  sendError(res, 400, 'BAD_REQUEST', message);
}
