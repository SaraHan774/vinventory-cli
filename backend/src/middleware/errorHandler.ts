import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/wine';

/**
 * 글로벌 에러 핸들러 미들웨어
 * 
 * 애플리케이션에서 발생하는 모든 에러를 일관된 형태로 처리합니다.
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('🚨 글로벌 에러 발생:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // 이미 응답이 전송된 경우
  if (res.headersSent) {
    return next(error);
  }

  // 기본 에러 응답
  const errorResponse: ErrorResponse = {
    success: false,
    error: 'INTERNAL_ERROR',
    message: '서버 내부 오류가 발생했습니다.'
  };

  // 개발 환경에서는 상세한 에러 정보 포함
  if (process.env.NODE_ENV === 'development') {
    errorResponse.message = error.message;
  }

  res.status(500).json(errorResponse);
}

/**
 * 404 에러 핸들러
 * 
 * 존재하지 않는 라우트에 대한 요청을 처리합니다.
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const errorResponse: ErrorResponse = {
    success: false,
    error: 'NOT_FOUND',
    message: `요청한 리소스를 찾을 수 없습니다: ${req.method} ${req.url}`
  };

  res.status(404).json(errorResponse);
}

/**
 * 비동기 함수 에러 래퍼
 * 
 * 비동기 라우트 핸들러에서 발생하는 에러를 자동으로 catch합니다.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
