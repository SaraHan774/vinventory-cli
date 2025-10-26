/**
 * 모바일 앱용 API 서비스
 * 
 * 백엔드 API와 통신하는 서비스 클래스입니다.
 */

import axios, { AxiosResponse } from 'axios';
import { Wine, CreateWineRequest, UpdateWineRequest, WineListResponse } from '../types/wine';
import { WineNote, CreateWineNoteRequest, UpdateWineNoteRequest, WineNoteListResponse } from '../types/wineNote';

// API 설정
const API_CONFIG = {
  BASE_URL: 'http://localhost:8590/api/v1',
  TIMEOUT: 10000,
};

// API 클라이언트 설정
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'x-client-type': 'mobile',
    'x-client-version': '1.0.0',
    'x-user-agent': 'vinventory-mobile'
  }
});

/**
 * 와인 API 서비스 클래스
 */
export class WineApiService {
  /**
   * 모든 와인 조회
   */
  static async getAllWines(): Promise<Wine[]> {
    const response: AxiosResponse<{ success: boolean; data: { wines: Wine[] } }> = 
      await apiClient.get('/wines');
    return response.data.data.wines;
  }

  /**
   * 특정 와인 조회
   */
  static async getWineById(id: string): Promise<Wine> {
    const response: AxiosResponse<{ success: boolean; data: Wine }> = 
      await apiClient.get(`/wines/${id}`);
    return response.data.data;
  }

  /**
   * 새 와인 생성
   */
  static async createWine(wineData: CreateWineRequest): Promise<Wine> {
    const response: AxiosResponse<{ success: boolean; data: Wine }> = 
      await apiClient.post('/wines', wineData);
    return response.data.data;
  }

  /**
   * 와인 업데이트
   */
  static async updateWine(id: string, wineData: UpdateWineRequest): Promise<Wine> {
    const response: AxiosResponse<{ success: boolean; data: Wine }> = 
      await apiClient.put(`/wines/${id}`, wineData);
    return response.data.data;
  }

  /**
   * 와인 삭제
   */
  static async deleteWine(id: string): Promise<void> {
    await apiClient.delete(`/wines/${id}`);
  }

  /**
   * 와인 수량 업데이트
   */
  static async updateWineQuantity(id: string, quantity: number): Promise<Wine> {
    const response: AxiosResponse<{ success: boolean; data: Wine }> = 
      await apiClient.patch(`/wines/${id}/quantity`, { quantity });
    return response.data.data;
  }

  /**
   * 와인 검색
   */
  static async searchWines(query: string): Promise<Wine[]> {
    const response: AxiosResponse<{ success: boolean; data: Wine[] }> = 
      await apiClient.get('/wines/search', { params: { q: query } });
    return response.data.data;
  }

  /**
   * 저재고 와인 조회
   */
  static async getLowStockWines(threshold: number = 5): Promise<Wine[]> {
    const response: AxiosResponse<{ success: boolean; data: Wine[] }> = 
      await apiClient.get('/wines/low-stock', { params: { threshold } });
    return response.data.data;
  }
}

/**
 * 와인 노트 API 서비스 클래스
 */
export class WineNoteApiService {
  /**
   * 모든 노트 조회 (전체 노트 목록)
   */
  static async getAllNotes(): Promise<WineNoteListResponse> {
    const response: AxiosResponse<{ success: boolean; data: WineNoteListResponse }> = 
      await apiClient.get('/notes');
    return response.data.data;
  }

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
