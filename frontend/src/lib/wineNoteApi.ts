/**
 * 와인 노트 API 서비스
 * 
 * Google Keep 스타일의 와인 노트 CRUD 작업을 담당합니다.
 */

import axios, { AxiosResponse } from 'axios';
import { WineNote, CreateWineNoteRequest, UpdateWineNoteRequest, WineNoteListResponse } from '../types/wineNote';
import { API_CONFIG } from '../config/api';

// API 클라이언트 설정
const apiClient = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api/v1`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'x-client-type': 'web',
    'x-client-version': '1.0.0',
    'x-user-agent': 'vinventory-frontend'
  }
});

/**
 * 와인 노트 API 서비스 클래스
 */
export class WineNoteApiService {
  /**
   * 특정 와인의 모든 노트 조회
   */
  static async getWineNotes(wineId: string): Promise<WineNoteListResponse> {
    const response: AxiosResponse<{ success: boolean; data: WineNoteListResponse }> = 
      await apiClient.get(`/wines/${wineId}/notes`);
    return response.data.data;
  }

  /**
   * 특정 노트 조회
   */
  static async getWineNoteById(wineId: string, noteId: string): Promise<WineNote> {
    const response: AxiosResponse<{ success: boolean; data: WineNote }> = 
      await apiClient.get(`/wines/${wineId}/notes/${noteId}`);
    return response.data.data;
  }

  /**
   * 새 와인 노트 생성
   */
  static async createWineNote(wineId: string, noteData: Omit<CreateWineNoteRequest, 'wine_id'>): Promise<WineNote> {
    const response: AxiosResponse<{ success: boolean; data: WineNote }> = 
      await apiClient.post(`/wines/${wineId}/notes`, noteData);
    return response.data.data;
  }

  /**
   * 와인 노트 업데이트
   */
  static async updateWineNote(wineId: string, noteId: string, noteData: UpdateWineNoteRequest): Promise<WineNote> {
    const response: AxiosResponse<{ success: boolean; data: WineNote }> = 
      await apiClient.put(`/wines/${wineId}/notes/${noteId}`, noteData);
    return response.data.data;
  }

  /**
   * 와인 노트 삭제
   */
  static async deleteWineNote(wineId: string, noteId: string): Promise<void> {
    await apiClient.delete(`/wines/${wineId}/notes/${noteId}`);
  }

  /**
   * 와인 노트 고정/고정 해제
   */
  static async togglePinWineNote(wineId: string, noteId: string, isPinned: boolean): Promise<WineNote> {
    const response: AxiosResponse<{ success: boolean; data: WineNote }> = 
      await apiClient.patch(`/wines/${wineId}/notes/${noteId}/pin`, { is_pinned: isPinned });
    return response.data.data;
  }

  /**
   * 와인 노트 색상 변경
   */
  static async changeWineNoteColor(wineId: string, noteId: string, color: string): Promise<WineNote> {
    const response: AxiosResponse<{ success: boolean; data: WineNote }> = 
      await apiClient.patch(`/wines/${wineId}/notes/${noteId}/color`, { color });
    return response.data.data;
  }
}
