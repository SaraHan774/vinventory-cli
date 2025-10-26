/**
 * 모바일 앱용 와인 노트 타입 정의
 * 
 * 공통 타입을 확장하여 모바일 특화 타입을 정의합니다.
 */

// 와인 정보 타입
export interface WineInfo {
  id: string;
  name: string;
  vintage: number;
  country_code: string;
}

// 기본 와인 노트 타입들
export interface WineNote {
  id: string;
  wine_id: string;
  title: string;
  content: string | null;
  color: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  wines?: WineInfo; // 와인 정보 (전체 노트 조회 시 포함)
}

export interface CreateWineNoteRequest {
  title: string;
  content?: string | null;
  color?: string | null;
  is_pinned?: boolean;
}

export interface UpdateWineNoteRequest {
  title?: string;
  content?: string | null;
  color?: string | null;
  is_pinned?: boolean;
}

export interface WineNoteListResponse {
  notes: WineNote[];
  total: number;
}

export const NOTE_COLORS = [
  '#FFFFFF', '#FFF8B8', '#FFF380', '#FFD966', '#FFC107', '#FF9800',
  '#FF5722', '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5'
];

// 모바일 특화 타입들
export interface WineNoteCardProps {
  note: WineNote;
  wineId: string;
  onEdit?: (note: WineNote) => void;
  onDelete?: (noteId: string) => void;
  onTogglePin?: (noteId: string, isPinned: boolean) => void;
  onColorChange?: (noteId: string, color: string) => void;
}

export interface WineNoteFormData {
  title: string;
  content: string;
  color: string;
  is_pinned: boolean;
}
