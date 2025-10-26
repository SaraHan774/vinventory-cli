/**
 * 와인 노트 관련 React Query 훅들
 * 
 * 모바일 앱에서 와인 노트를 관리하기 위한 커스텀 훅들입니다.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WineNoteApiService } from '../services/api';
import { CreateWineNoteRequest, UpdateWineNoteRequest, WineNote } from '../types/wineNote';

const WINE_NOTE_QUERY_KEYS = {
  all: (wineId: string) => ['wineNotes', wineId] as const,
  detail: (wineId: string, noteId: string) => ['wineNotes', wineId, noteId] as const,
};

/**
 * 모든 노트 조회 (전체 노트 목록)
 */
export function useAllNotes() {
  return useQuery({
    queryKey: ['allNotes'],
    queryFn: () => WineNoteApiService.getAllNotes(),
    select: (data: any) => data.notes, // notes 배열만 반환
  });
}

/**
 * 특정 와인의 노트 목록 조회
 */
export function useWineNotes(wineId: string) {
  return useQuery({
    queryKey: WINE_NOTE_QUERY_KEYS.all(wineId),
    queryFn: async () => {
      if (wineId === 'all') {
        // 모든 노트를 가져오는 로직
        return await WineNoteApiService.getAllNotes();
      }
      return await WineNoteApiService.getWineNotes(wineId);
    },
    enabled: !!wineId,
    select: (data: any) => data.notes, // notes 배열만 반환
  });
}

/**
 * 특정 와인 노트 조회
 */
export function useWineNote(wineId: string, noteId: string) {
  return useQuery({
    queryKey: WINE_NOTE_QUERY_KEYS.detail(wineId, noteId),
    queryFn: () => WineNoteApiService.getWineNoteById(wineId, noteId),
    enabled: !!wineId && !!noteId,
  });
}

/**
 * 와인 노트 생성
 */
export function useCreateWineNote(wineId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteData: CreateWineNoteRequest) => 
      WineNoteApiService.createWineNote(wineId, noteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WINE_NOTE_QUERY_KEYS.all(wineId) });
    },
  });
}

/**
 * 와인 노트 수정
 */
export function useUpdateWineNote(wineId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, noteData }: { noteId: string; noteData: UpdateWineNoteRequest }) =>
      WineNoteApiService.updateWineNote(wineId, noteId, noteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WINE_NOTE_QUERY_KEYS.all(wineId) });
    },
  });
}

/**
 * 와인 노트 삭제
 */
export function useDeleteWineNote(wineId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => WineNoteApiService.deleteWineNote(wineId, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WINE_NOTE_QUERY_KEYS.all(wineId) });
    },
  });
}

/**
 * 와인 노트 고정/고정 해제
 */
export function useTogglePinWineNote(wineId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, isPinned }: { noteId: string; isPinned: boolean }) =>
      WineNoteApiService.togglePinWineNote(wineId, noteId, isPinned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WINE_NOTE_QUERY_KEYS.all(wineId) });
    },
  });
}

/**
 * 와인 노트 색상 변경
 */
export function useChangeWineNoteColor(wineId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, color }: { noteId: string; color: string }) =>
      WineNoteApiService.changeWineNoteColor(wineId, noteId, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WINE_NOTE_QUERY_KEYS.all(wineId) });
    },
  });
}