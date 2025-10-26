/**
 * 모바일 앱용 와인 React Query 훅
 * 
 * React Query를 사용한 와인 데이터 관리 훅들입니다.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WineApiService } from '../services/api';
import { CreateWineRequest, UpdateWineRequest } from '../types/wine';

// Query Keys
export const WINE_QUERY_KEYS = {
  all: ['wines'] as const,
  lists: () => [...WINE_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...WINE_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...WINE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...WINE_QUERY_KEYS.details(), id] as const,
  lowStock: (threshold: number) => [...WINE_QUERY_KEYS.all, 'low-stock', threshold] as const,
};

/**
 * 모든 와인 조회 훅
 */
export function useWines() {
  return useQuery({
    queryKey: WINE_QUERY_KEYS.lists(),
    queryFn: WineApiService.getAllWines,
    staleTime: 5 * 60 * 1000, // 5분
  });
}

/**
 * 특정 와인 조회 훅
 */
export function useWine(id: string) {
  return useQuery({
    queryKey: WINE_QUERY_KEYS.detail(id),
    queryFn: () => WineApiService.getWineById(id),
    enabled: !!id,
  });
}

/**
 * 와인 생성 뮤테이션 훅
 */
export function useCreateWine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: WineApiService.createWine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WINE_QUERY_KEYS.lists() });
    },
  });
}

/**
 * 와인 업데이트 뮤테이션 훅
 */
export function useUpdateWine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWineRequest }) =>
      WineApiService.updateWine(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: WINE_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: WINE_QUERY_KEYS.lists() });
    },
  });
}

/**
 * 와인 삭제 뮤테이션 훅
 */
export function useDeleteWine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: WineApiService.deleteWine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WINE_QUERY_KEYS.lists() });
    },
  });
}

/**
 * 와인 수량 업데이트 뮤테이션 훅
 */
export function useUpdateWineQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      WineApiService.updateWineQuantity(id, quantity),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: WINE_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: WINE_QUERY_KEYS.lists() });
    },
  });
}

/**
 * 와인 검색 뮤테이션 훅
 */
export function useSearchWines() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (query: string) => WineApiService.searchWines(query),
    onSuccess: (searchResults) => {
      // 검색 결과를 캐시에 저장하여 목록에 반영
      queryClient.setQueryData(WINE_QUERY_KEYS.lists(), searchResults);
    },
  });
}

/**
 * 저재고 와인 조회 훅
 */
export function useLowStockWines(threshold: number = 5) {
  return useQuery({
    queryKey: WINE_QUERY_KEYS.lowStock(threshold),
    queryFn: () => WineApiService.getLowStockWines(threshold),
  });
}
