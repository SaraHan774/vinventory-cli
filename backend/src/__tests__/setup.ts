/**
 * Jest 테스트 설정 파일
 * 
 * 전역 테스트 설정과 Mock을 정의합니다.
 */

import { jest } from '@jest/globals';

// 환경 변수 설정
process.env.NODE_ENV = 'test';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';

// Console 로그 억제 (테스트 중 노이즈 방지)
const originalConsole = console;
global.console = {
  ...originalConsole,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// 테스트 타임아웃 설정
jest.setTimeout(10000);
