/**
 * 와인 노트 관련 TypeScript 타입 정의
 * 
 * 백엔드 API와 일치하는 타입들을 정의합니다.
 */

export interface WineNote {
  id: string;
  wine_id: string;
  title: string;
  content?: string | null;
  color: string; // HEX 색상 코드
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateWineNoteRequest {
  wine_id: string;
  title: string;
  content?: string | null;
  color?: string;
  is_pinned?: boolean;
}

export interface UpdateWineNoteRequest {
  title?: string;
  content?: string | null;
  color?: string;
  is_pinned?: boolean;
}

export interface WineNoteListResponse {
  notes: WineNote[];
  total: number;
}

/**
 * 노트 색상 옵션 (Google Keep 스타일)
 */
export const NOTE_COLORS = [
  '#FFFFFF', // 흰색 (기본)
  '#F28B82', // 빨간색
  '#FBBC04', // 노란색
  '#FFF475', // 연노란색
  '#CCFF90', // 연두색
  '#A7FFEB', // 연청록색
  '#CBF0F8', // 연파란색
  '#AECBFA', // 연보라색
  '#D7AEFB', // 연보라색
  '#FDCFE8', // 연분홍색
  '#E6C9A8', // 베이지색
  '#E8EAED'  // 회색
] as const;

export type NoteColor = typeof NOTE_COLORS[number];
