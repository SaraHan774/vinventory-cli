/**
 * 와인 도메인 모델 타입 정의
 * 
 * TypeScript에서 사용할 와인 관련 타입들을 정의합니다.
 * 기존 Kotlin 모델과 호환성을 유지합니다.
 */

/**
 * 와인 엔티티 타입
 */
export interface Wine {
  id: string;
  name: string;
  country_code: string;
  vintage: number;
  price: number;
  quantity: number;
  vivino_url?: string | null;
  wine_searcher_url?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 와인 생성 요청 타입
 */
export interface CreateWineRequest {
  name: string;
  country_code: string;
  vintage: number;
  price: number;
  quantity: number;
  vivino_url?: string | null;
  wine_searcher_url?: string | null;
}

/**
 * 와인 업데이트 요청 타입
 */
export interface UpdateWineRequest {
  name?: string;
  country_code?: string;
  vintage?: number;
  price?: number;
  quantity?: number;
  vivino_url?: string | null;
  wine_searcher_url?: string | null;
}

/**
 * 와인 검색 필터 타입
 */
export interface WineSearchFilter {
  name?: string;
  country_code?: string;
  vintage_min?: number | undefined;
  vintage_max?: number | undefined;
  price_min?: number | undefined;
  price_max?: number | undefined;
  low_stock?: boolean;
}

/**
 * 와인 정렬 옵션 타입
 */
export type WineSortField = 'name' | 'country_code' | 'vintage' | 'price' | 'quantity' | 'created_at' | 'updated_at';
export type WineSortOrder = 'asc' | 'desc';

/**
 * 와인 정렬 설정 타입
 */
export interface WineSortOptions {
  field: WineSortField;
  order: WineSortOrder;
}

/**
 * 와인 페이지네이션 타입
 */
export interface WinePagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

/**
 * 와인 목록 응답 타입
 */
export interface WineListResponse {
  wines: Wine[];
  pagination: WinePagination;
}

/**
 * API 응답 기본 타입
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * 에러 응답 타입
 */
export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
}
