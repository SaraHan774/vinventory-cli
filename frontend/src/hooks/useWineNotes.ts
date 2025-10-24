/**
 * 와인 노트 React Query 훅
 * 
 * Google Keep 스타일의 와인 노트 CRUD 작업을 위한 커스텀 훅들입니다.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WineNoteApiService } from '../lib/wineNoteApi';
import { CreateWineNoteRequest, UpdateWineNoteRequest } from '../types/wineNote';

/**
 * 와인 노트 목록 조회 훅
 */
export function useWineNotes(wineId: string) {
  return useQuery({
    queryKey: ['wineNotes', wineId],
    queryFn: () => WineNoteApiService.getWineNotes(wineId),
    enabled: !!wineId,
    staleTime: 5 * 60 * 1000, // 5분
  });
}

/**
 * 특정 와인 노트 조회 훅
 */
export function useWineNote(wineId: string, noteId: string) {
  return useQuery({
    queryKey: ['wineNote', wineId, noteId],
    queryFn: () => WineNoteApiService.getWineNoteById(wineId, noteId),
    enabled: !!wineId && !!noteId,
  });
}

/**
 * 와인 노트 생성 뮤테이션 훅
 */
export function useCreateWineNote(wineId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteData: Omit<CreateWineNoteRequest, 'wine_id'>) =>
      WineNoteApiService.createWineNote(wineId, noteData),
    onSuccess: () => {
      // 와인 노트 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['wineNotes', wineId] });
    },
  });
}

/**
 * 와인 노트 업데이트 뮤테이션 훅
 */
export function useUpdateWineNote(wineId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, noteData }: { noteId: string; noteData: UpdateWineNoteRequest }) =>
      WineNoteApiService.updateWineNote(wineId, noteId, noteData),
    onSuccess: () => {
      // 와인 노트 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['wineNotes', wineId] });
    },
  });
}

/**
 * 와인 노트 삭제 뮤테이션 훅
 */
export function useDeleteWineNote(wineId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => WineNoteApiService.deleteWineNote(wineId, noteId),
    onSuccess: () => {
      // 와인 노트 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['wineNotes', wineId] });
    },
  });
}

/**
 * 와인 노트 고정/해제 뮤테이션 훅
 */
export function useTogglePinWineNote(wineId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, isPinned }: { noteId: string; isPinned: boolean }) =>
      WineNoteApiService.togglePinWineNote(wineId, noteId, isPinned),
    onSuccess: () => {
      // 와인 노트 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['wineNotes', wineId] });
    },
  });
}

/**
 * 와인 노트 색상 변경 뮤테이션 훅
 */
export function useChangeWineNoteColor(wineId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, color }: { noteId: string; color: string }) =>
      WineNoteApiService.changeWineNoteColor(wineId, noteId, color),
    onSuccess: () => {
      // 와인 노트 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['wineNotes', wineId] });
    },
  });
}
