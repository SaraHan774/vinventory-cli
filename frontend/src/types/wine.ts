/**
 * 와인 관련 TypeScript 타입 정의
 * 
 * 백엔드 API와 일치하는 타입들을 정의합니다.
 */

export interface Wine {
  id: string;
  name: string;
  countryCode: string;
  vintage: number;
  price: number;
  quantity: number;
}

export interface CreateWineRequest {
  name: string;
  countryCode: string;
  vintage: number;
  price: number;
  quantity: number;
}

export interface UpdateWineRequest {
  name?: string;
  countryCode?: string;
  vintage?: number;
  price?: number;
  quantity?: number;
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
