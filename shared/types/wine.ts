/**
 * 공통 와인 타입 정의
 * 
 * 웹과 모바일 앱에서 공유하는 타입들입니다.
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

export interface WineSearchFilter {
  name?: string;
  country_code?: string;
  vintage_min?: number;
  vintage_max?: number;
  price_min?: number;
  price_max?: number;
  low_stock?: boolean;
}

export type WineSortField = 'name' | 'country_code' | 'vintage' | 'price' | 'quantity' | 'created_at' | 'updated_at';
export type WineSortOrder = 'asc' | 'desc';

export interface WineSortOptions {
  field: WineSortField;
  order: WineSortOrder;
}

export interface WineListResponse {
  wines: Wine[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
