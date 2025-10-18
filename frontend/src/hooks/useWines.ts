/**
 * 와인 관련 React Query 커스텀 훅
 * 
 * React Query (TanStack Query)를 사용하여 서버 상태를 관리합니다.
 * Context7에서 가져온 Vite 문서를 참조하여 구현했습니다.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WineService } from '../lib/supabase';
import type { 
  CreateWineRequest, 
  UpdateWineRequest, 
  UpdateWineQuantityRequest,
  WineFilters 
} from '../types/wine';

// React Query 키 상수
export const WINE_QUERY_KEYS = {
  all: ['wines'] as const,
  lists: () => [...WINE_QUERY_KEYS.all, 'list'] as const,
  list: (filters: WineFilters) => [...WINE_QUERY_KEYS.lists(), filters] as const,
  details: () => [...WINE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...WINE_QUERY_KEYS.details(), id] as const,
  search: (query: string) => [...WINE_QUERY_KEYS.all, 'search', query] as const,
  lowStock: (threshold: number) => [...WINE_QUERY_KEYS.all, 'lowStock', threshold] as const,
} as const;

/**
 * 모든 와인 조회 훅
 * 
 * @returns 와인 목록과 로딩/에러 상태
 */
export function useWines() {
  return useQuery({
    queryKey: WINE_QUERY_KEYS.lists(),
    queryFn: WineService.getAllWines,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
}

/**
 * 특정 와인 조회 훅
 * 
 * @param id 와인 ID
 * @returns 와인 정보와 로딩/에러 상태
 */
export function useWine(id: string) {
  return useQuery({
    queryKey: WINE_QUERY_KEYS.detail(id),
    queryFn: () => WineService.getWineById(id),
    enabled: !!id, // ID가 있을 때만 실행
  });
}

/**
 * 와인 검색 훅
 * 
 * @param query 검색 쿼리
 * @returns 검색된 와인 목록과 로딩/에러 상태
 */
export function useSearchWines(query: string) {
  return useQuery({
    queryKey: WINE_QUERY_KEYS.search(query),
    queryFn: () => WineService.searchWines(query),
    enabled: !!query && query.length > 0, // 쿼리가 있을 때만 실행
  });
}

/**
 * 와인 필터링 훅
 * 
 * @param filters 필터링 조건
 * @returns 필터링된 와인 목록과 로딩/에러 상태
 */
export function useFilterWines(filters: WineFilters) {
  return useQuery({
    queryKey: WINE_QUERY_KEYS.list(filters),
    queryFn: async () => {
      // Supabase에서 필터링 로직 구현
      if (filters.vintageStart && filters.vintageEnd) {
        return WineService.filterByVintageRange(filters.vintageStart, filters.vintageEnd);
      } else if (filters.minPrice && filters.maxPrice) {
        return WineService.filterByPriceRange(filters.minPrice, filters.maxPrice);
      } else if (filters.country) {
        return WineService.filterByCountry(filters.country);
      }
      return [];
    },
    enabled: Object.values(filters).some(value => value !== undefined && value !== ''), // 필터가 있을 때만 실행
  });
}

/**
 * 재고 부족 와인 조회 훅
 * 
 * @param threshold 재고 부족 기준
 * @returns 재고 부족 와인 목록과 로딩/에러 상태
 */
export function useLowStockWines(threshold: number = 5) {
  return useQuery({
    queryKey: WINE_QUERY_KEYS.lowStock(threshold),
    queryFn: () => WineService.getLowStockWines(threshold),
  });
}

/**
 * 와인 생성 뮤테이션 훅
 * 
 * @returns 와인 생성 함수와 로딩/에러 상태
 */
export function useCreateWine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wineData: CreateWineRequest) => {
      // 데이터베이스 스키마에 맞게 수정 (created_at, updated_at, isActive 필드 제거)
      return WineService.createWine(wineData);
    },
    onSuccess: () => {
      // 와인 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: WINE_QUERY_KEYS.lists() });
    },
  });
}

/**
 * 와인 업데이트 뮤테이션 훅
 * 
 * @returns 와인 업데이트 함수와 로딩/에러 상태
 */
export function useUpdateWine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, wineData }: { id: string; wineData: UpdateWineRequest }) => 
      WineService.updateWine(id, wineData),
    onSuccess: (updatedWine) => {
      // 특정 와인 캐시 업데이트
      queryClient.setQueryData(WINE_QUERY_KEYS.detail(updatedWine.id), updatedWine);
      // 와인 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: WINE_QUERY_KEYS.lists() });
    },
  });
}

/**
 * 와인 수량 업데이트 뮤테이션 훅
 * 
 * @returns 와인 수량 업데이트 함수와 로딩/에러 상태
 */
export function useUpdateWineQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quantityData }: { id: string; quantityData: UpdateWineQuantityRequest }) => {
      // 기존 와인 조회
      const existingWine = await WineService.getWineById(id);
      // 수량 업데이트
      return WineService.updateWine(id, { 
        quantity: existingWine.quantity + quantityData.quantity 
      });
    },
    onSuccess: (updatedWine) => {
      // 특정 와인 캐시 업데이트
      queryClient.setQueryData(WINE_QUERY_KEYS.detail(updatedWine.id), updatedWine);
      // 와인 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: WINE_QUERY_KEYS.lists() });
    },
  });
}

/**
 * 와인 삭제 뮤테이션 훅
 * 
 * @returns 와인 삭제 함수와 로딩/에러 상태
 */
export function useDeleteWine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => WineService.deleteWine(id),
    onSuccess: (_, deletedId) => {
      // 삭제된 와인 캐시 제거
      queryClient.removeQueries({ queryKey: WINE_QUERY_KEYS.detail(deletedId) });
      // 와인 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: WINE_QUERY_KEYS.lists() });
    },
  });
}
