/**
 * 와인 노트 서비스 클래스
 * 
 * Google Keep 스타일의 와인 노트 CRUD 작업을 담당합니다.
 */

import { supabase } from '../config/supabase';
import {
  WineNote,
  CreateWineNoteRequest,
  UpdateWineNoteRequest,
  WineNoteSearchFilter,
  WineNoteSortOptions,
  WineNoteListResponse
} from '../types/wineNote';
import { NotFoundError, InternalServerError } from '../errors/HttpErrors';

export class WineNoteService {
  
  /**
   * 모든 노트 조회 (전체 노트 목록)
   * 
   * @param filter 검색 필터
   * @param sort 정렬 옵션
   * @returns 모든 와인 노트 목록
   */
  async getAllNotes(
    filter: WineNoteSearchFilter = {},
    sort: WineNoteSortOptions = { field: 'created_at', order: 'desc' }
  ): Promise<WineNoteListResponse> {
    try {
      let query = supabase
        .from('wine_notes')
        .select(`
          *,
          wines!inner(id, name, vintage, country_code)
        `);

      // 필터링 적용
      if (filter.title) {
        query = query.ilike('title', `%${filter.title}%`);
      }
      if (filter.color) {
        query = query.eq('color', filter.color);
      }
      if (filter.is_pinned !== undefined) {
        query = query.eq('is_pinned', filter.is_pinned);
      }
      if (filter.created_after) {
        query = query.gte('created_at', filter.created_after);
      }
      if (filter.created_before) {
        query = query.lte('created_at', filter.created_before);
      }

      // 정렬 적용
      const { data, error } = await query.order(sort.field, { ascending: sort.order === 'asc' });

      if (error) {
        throw new InternalServerError(`전체 노트 조회 실패: ${error.message}`);
      }

      return {
        notes: data || [],
        total: data?.length || 0
      };
    } catch (error) {
      console.error('전체 노트 조회 오류:', error);
      throw error;
    }
  }

  /**
   * 특정 와인의 모든 노트 조회
   * 
   * @param wineId 와인 ID
   * @param filter 검색 필터
   * @param sort 정렬 옵션
   * @returns 와인 노트 목록
   */
  async getWineNotes(
    wineId: string,
    filter: WineNoteSearchFilter = {},
    sort: WineNoteSortOptions = { field: 'created_at', order: 'desc' }
  ): Promise<WineNoteListResponse> {
    try {
      let query = supabase
        .from('wine_notes')
        .select('*')
        .eq('wine_id', wineId);

      // 필터 적용
      if (filter.title) {
        query = query.ilike('title', `%${filter.title}%`);
      }
      if (filter.color) {
        query = query.eq('color', filter.color);
      }
      if (filter.is_pinned !== undefined) {
        query = query.eq('is_pinned', filter.is_pinned);
      }
      if (filter.created_after) {
        query = query.gte('created_at', filter.created_after);
      }
      if (filter.created_before) {
        query = query.lte('created_at', filter.created_before);
      }

      // 정렬 적용
      query = query.order(sort.field, { ascending: sort.order === 'asc' });

      const { data, error } = await query;

      if (error) {
        throw new InternalServerError(`와인 노트 조회 실패: ${error.message}`);
      }

      return {
        notes: data || [],
        total: data?.length || 0
      };
    } catch (error) {
      console.error('와인 노트 조회 오류:', error);
      throw error;
    }
  }

  /**
   * 특정 노트 조회
   * 
   * @param id 노트 ID
   * @returns 와인 노트 정보
   */
  async getWineNoteById(id: string): Promise<WineNote> {
    try {
      const { data, error } = await supabase
        .from('wine_notes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('와인 노트를 찾을 수 없습니다.');
        }
        throw new InternalServerError(`와인 노트 조회 실패: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('와인 노트 조회 오류:', error);
      throw error;
    }
  }

  /**
   * 새 와인 노트 생성
   * 
   * @param noteData 와인 노트 생성 데이터
   * @returns 생성된 와인 노트 정보
   */
  async createWineNote(noteData: CreateWineNoteRequest): Promise<WineNote> {
    try {
      const { data, error } = await supabase
        .from('wine_notes')
        .insert([{
          ...noteData,
          color: noteData.color || '#FFFFFF',
          is_pinned: noteData.is_pinned || false
        }])
        .select()
        .single();

      if (error) {
        throw new InternalServerError(`와인 노트 생성 실패: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('와인 노트 생성 오류:', error);
      throw error;
    }
  }

  /**
   * 와인 노트 업데이트
   * 
   * @param id 노트 ID
   * @param noteData 업데이트할 노트 데이터
   * @returns 업데이트된 와인 노트 정보
   */
  async updateWineNote(id: string, noteData: UpdateWineNoteRequest): Promise<WineNote> {
    try {
      const { data, error } = await supabase
        .from('wine_notes')
        .update({
          ...noteData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('와인 노트를 찾을 수 없습니다.');
        }
        throw new InternalServerError(`와인 노트 업데이트 실패: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('와인 노트 업데이트 오류:', error);
      throw error;
    }
  }

  /**
   * 와인 노트 삭제
   * 
   * @param id 노트 ID
   */
  async deleteWineNote(id: string): Promise<void> {
    try {
      // 먼저 노트가 존재하는지 확인
      const existingNote = await this.getWineNoteById(id);
      if (!existingNote) {
        throw new NotFoundError('와인 노트를 찾을 수 없습니다.');
      }

      const { error } = await supabase
        .from('wine_notes')
        .delete()
        .eq('id', id);

      if (error) {
        throw new InternalServerError(`와인 노트 삭제 실패: ${error.message}`);
      }
    } catch (error) {
      console.error('와인 노트 삭제 오류:', error);
      throw error;
    }
  }

  /**
   * 와인 노트 고정/고정 해제
   * 
   * @param id 노트 ID
   * @param isPinned 고정 여부
   * @returns 업데이트된 와인 노트 정보
   */
  async togglePinWineNote(id: string, isPinned: boolean): Promise<WineNote> {
    return this.updateWineNote(id, { is_pinned: isPinned });
  }

  /**
   * 와인 노트 색상 변경
   * 
   * @param id 노트 ID
   * @param color 새로운 색상
   * @returns 업데이트된 와인 노트 정보
   */
  async changeWineNoteColor(id: string, color: string): Promise<WineNote> {
    return this.updateWineNote(id, { color });
  }
}
