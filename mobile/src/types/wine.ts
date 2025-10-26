/**
 * 모바일 앱용 와인 타입 정의
 * 
 * 공통 타입을 확장하여 모바일 특화 타입을 정의합니다.
 */

// 기본 와인 타입들
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

export interface CreateWineRequest {
  name: string;
  country_code: string;
  vintage: number;
  price: number;
  quantity: number;
  vivino_url?: string | null;
  wine_searcher_url?: string | null;
}

export interface UpdateWineRequest {
  name?: string;
  country_code?: string;
  vintage?: number;
  price?: number;
  quantity?: number;
  vivino_url?: string | null;
  wine_searcher_url?: string | null;
}

export interface WineListResponse {
  wines: Wine[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// 모바일 특화 타입들
export interface WineListItem extends Wine {
  // 모바일에서 추가로 필요한 필드들
  isLowStock?: boolean;
  lastUpdated?: string;
}

export interface WineFormData {
  name: string;
  country_code: string;
  vintage: number;
  price: number;
  quantity: number;
  vivino_url?: string;
  wine_searcher_url?: string;
}
