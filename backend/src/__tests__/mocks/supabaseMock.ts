/**
 * Supabase Mock 유틸리티
 * 
 * 테스트를 위한 Supabase 클라이언트 Mock을 제공합니다.
 */

import { Wine } from '../../types/wine';

// Mock 데이터
export const mockWines: Wine[] = [
  {
    id: '1',
    name: 'Château Margaux 2015',
    country_code: 'FR',
    vintage: 2015,
    price: 1500000,
    quantity: 3,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Opus One 2018',
    country_code: 'US',
    vintage: 2018,
    price: 800000,
    quantity: 2,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Sassicaia 2019',
    country_code: 'IT',
    vintage: 2019,
    price: 600000,
    quantity: 1,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z'
  }
];

/**
 * Supabase Mock 클라이언트 생성
 */
export function createSupabaseMock() {
  const mockSelect = jest.fn().mockReturnThis();
  const mockFrom = jest.fn().mockReturnValue({
    select: mockSelect,
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    single: jest.fn()
  });

  return {
    from: mockFrom,
    auth: {
      getUser: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn()
    }
  };
}

/**
 * 성공적인 데이터베이스 응답 Mock
 */
export function mockSuccessfulResponse(data: any, count?: number) {
  return {
    data,
    error: null,
    count: count || data?.length || 0
  };
}

/**
 * 에러 응답 Mock
 */
export function mockErrorResponse(message: string, code?: string) {
  return {
    data: null,
    error: {
      message,
      code,
      details: null,
      hint: null
    },
    count: 0
  };
}

/**
 * 와인 데이터 생성 헬퍼
 */
export function createMockWine(overrides: Partial<Wine> = {}): Wine {
  return {
    id: 'test-id',
    name: 'Test Wine',
    country_code: 'FR',
    vintage: 2020,
    price: 100000,
    quantity: 10,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides
  };
}
