import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/wine';
import { HttpError } from '../errors/HttpErrors';

/**
 * 글로벌 에러 핸들러 미들웨어
 *
 * 애플리케이션에서 발생하는 모든 에러를 일관된 형태로 처리합니다.
 * HttpError 인스턴스는 상태 코드와 에러 코드를 포함하여 처리됩니다.
 */
export function errorHandler(
  error: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('🚨 글로벌 에러 발생:', {
    name: error.name,
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

  // HttpError 인스턴스인 경우
  if (error instanceof HttpError) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: error.errorCode || 'HTTP_ERROR',
      message: error.message
    };

    res.status(error.statusCode).json(errorResponse);
    return;
  }

  // 일반 Error 객체지만 메시지로 타입 추론
  // (주로 테스트나 레거시 코드 호환성을 위함)
  let status = 500;
  let errorCode = 'INTERNAL_ERROR';

  if (error.message.includes('찾을 수 없습니다') || error.message.includes('not found')) {
    status = 404;
    errorCode = 'NOT_FOUND';
  } else if (error.message.includes('검증') || error.message.includes('validation')) {
    status = 400;
    errorCode = 'VALIDATION_ERROR';
  }

  const errorResponse: ErrorResponse = {
    success: false,
    error: errorCode,
    message: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' || status !== 500)
      ? error.message
      : '서버 내부 오류가 발생했습니다.'
  };

  res.status(status).json(errorResponse);
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
