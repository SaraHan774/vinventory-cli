/**
 * 와인 관련 TypeScript 타입 정의
 * 
 * 백엔드 API와 일치하는 타입들을 정의합니다.
 */

export interface Wine {
  id: string;
  name: string;
  country_code: string;  // 데이터베이스 컬럼명과 일치
  vintage: number;
  price: number;
  quantity: number;
  vivino_url?: string | null;
  wine_searcher_url?: string | null;
  created_at: string;     // 데이터베이스 컬럼명과 일치
  updated_at: string;     // 데이터베이스 컬럼명과 일치
}

export interface CreateWineRequest {
  name: string;
  country_code: string;  // 데이터베이스 컬럼명과 일치
  vintage: number;
  price: number;
  quantity: number;
  vivino_url?: string | null;
  wine_searcher_url?: string | null;
}

export interface UpdateWineRequest {
  name?: string;
  country_code?: string;  // 데이터베이스 컬럼명과 일치
  vintage?: number;
  price?: number;
  quantity?: number;
  vivino_url?: string | null;
  wine_searcher_url?: string | null;
}

export interface UpdateWineQuantityRequest {
  quantity: number;
}

export interface ErrorResponse {
  message: string;
  code?: string;
}

export interface SuccessResponse {
  success: boolean;
  message?: string;
}

/**
 * 와인 필터링 옵션
 */
export interface WineFilters {
  vintageStart?: number;
  vintageEnd?: number;
  minPrice?: number;
  maxPrice?: number;
  country?: string;
  searchQuery?: string;
}
