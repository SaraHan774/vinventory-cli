/**
 * 와인 노트 컨트롤러
 * 
 * Google Keep 스타일의 와인 노트 API 엔드포인트를 처리합니다.
 */

import { Request, Response } from 'express';
import { WineNoteService } from '../services/wineNoteService';
import { CreateWineNoteRequest, UpdateWineNoteRequest } from '../types/wineNote';
import { sendSuccess, sendCreated, sendError } from '../utils/responseUtils';

export class WineNoteController {
  private wineNoteService: WineNoteService;

  constructor() {
    this.wineNoteService = new WineNoteService();
  }

  /**
   * 모든 노트 조회 (전체 노트 목록)
   */
  async getAllNotes(req: Request, res: Response): Promise<void> {
    try {
      const { title, color, is_pinned, created_after, created_before } = req.query;
      const { sort_field = 'created_at', sort_order = 'desc' } = req.query;

      const filter = {
        title: title as string,
        color: color as string,
        is_pinned: is_pinned === 'true' ? true : is_pinned === 'false' ? false : undefined,
        created_after: created_after as string,
        created_before: created_before as string,
      };

      const sort = {
        field: sort_field as any,
        order: sort_order as 'asc' | 'desc',
      };

      const result = await this.wineNoteService.getAllNotes(filter, sort);
      sendSuccess(res, result, '전체 노트 목록을 조회했습니다.');
    } catch (error) {
      console.error('전체 노트 조회 오류:', error);
      sendError(res, 500, 'NOTES_FETCH_ERROR', '전체 노트 조회에 실패했습니다.');
    }
  }

  /**
   * 특정 와인의 모든 노트 조회
   */
  async getWineNotes(req: Request, res: Response): Promise<void> {
    try {
      const { wineId } = req.params;
      const { title, color, is_pinned, created_after, created_before } = req.query;
      const { sort_field = 'created_at', sort_order = 'desc' } = req.query;

      const filter = {
        title: title as string,
        color: color as string,
        is_pinned: is_pinned === 'true' ? true : is_pinned === 'false' ? false : undefined,
        created_after: created_after as string,
        created_before: created_before as string
      };

      const sort = {
        field: sort_field as any,
        order: sort_order as 'asc' | 'desc'
      };

      const result = await this.wineNoteService.getWineNotes(wineId, filter, sort);
      
      sendSuccess(res, result, '와인 노트 목록을 조회했습니다.');
    } catch (error) {
      console.error('와인 노트 조회 오류:', error);
      sendError(res, 500, 'WINE_NOTE_FETCH_ERROR', '와인 노트 조회에 실패했습니다.');
    }
  }

  /**
   * 특정 노트 조회
   */
  async getWineNoteById(req: Request, res: Response): Promise<void> {
    try {
      const { wineId, id } = req.params;
      const note = await this.wineNoteService.getWineNoteById(id);
      
      // wineId 검증 (노트가 해당 와인에 속하는지 확인)
      if (note.wine_id !== wineId) {
        res.status(404).json({ 
          success: false, 
          error: 'NOT_FOUND', 
          message: '해당 와인의 노트를 찾을 수 없습니다.' 
        });
        return;
      }
      
      sendSuccess(res, note, '와인 노트를 조회했습니다.');
    } catch (error) {
      console.error('와인 노트 조회 오류:', error);
      if ((error as any).name === 'NotFoundError') {
        res.status(404).json({ success: false, error: 'NOT_FOUND', message: '와인 노트를 찾을 수 없습니다.' });
      } else {
        sendError(res, 500, 'WINE_NOTE_FETCH_ERROR', '와인 노트 조회에 실패했습니다.');
      }
    }
  }

  /**
   * 새 와인 노트 생성
   */
  async createWineNote(req: Request, res: Response): Promise<void> {
    try {
      const { wineId } = req.params;
      const noteData: CreateWineNoteRequest = {
        ...req.body,
        wine_id: wineId
      };

      const note = await this.wineNoteService.createWineNote(noteData);
      
      sendCreated(res, note, '와인 노트가 생성되었습니다.');
    } catch (error) {
      console.error('와인 노트 생성 오류:', error);
      sendError(res, 500, 'WINE_NOTE_CREATE_ERROR', '와인 노트 생성에 실패했습니다.');
    }
  }

  /**
   * 와인 노트 업데이트
   */
  async updateWineNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const noteData: UpdateWineNoteRequest = req.body;

      const note = await this.wineNoteService.updateWineNote(id, noteData);
      
      sendSuccess(res, note, '와인 노트가 업데이트되었습니다.');
    } catch (error) {
      console.error('와인 노트 업데이트 오류:', error);
      if ((error as any).name === 'NotFoundError') {
        res.status(404).json({ success: false, error: 'NOT_FOUND', message: '와인 노트를 찾을 수 없습니다.' });
      } else {
        sendError(res, 500, 'WINE_NOTE_UPDATE_ERROR', '와인 노트 업데이트에 실패했습니다.');
      }
    }
  }

  /**
   * 와인 노트 삭제
   */
  async deleteWineNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.wineNoteService.deleteWineNote(id);
      
      sendSuccess(res, null, '와인 노트가 삭제되었습니다.');
    } catch (error) {
      console.error('와인 노트 삭제 오류:', error);
      if ((error as any).name === 'NotFoundError') {
        res.status(404).json({ success: false, error: 'NOT_FOUND', message: '와인 노트를 찾을 수 없습니다.' });
      } else {
        sendError(res, 500, 'WINE_NOTE_DELETE_ERROR', '와인 노트 삭제에 실패했습니다.');
      }
    }
  }

  /**
   * 와인 노트 고정/고정 해제
   */
  async togglePinWineNote(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { is_pinned } = req.body;

      const note = await this.wineNoteService.togglePinWineNote(id, is_pinned);
      
      sendSuccess(res, note, `와인 노트가 ${is_pinned ? '고정' : '고정 해제'}되었습니다.`);
    } catch (error) {
      console.error('와인 노트 고정 오류:', error);
      if ((error as any).name === 'NotFoundError') {
        res.status(404).json({ success: false, error: 'NOT_FOUND', message: '와인 노트를 찾을 수 없습니다.' });
      } else {
        sendError(res, 500, 'WINE_NOTE_PIN_ERROR', '와인 노트 고정에 실패했습니다.');
      }
    }
  }

  /**
   * 와인 노트 색상 변경
   */
  async changeWineNoteColor(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { color } = req.body;

      const note = await this.wineNoteService.changeWineNoteColor(id, color);
      
      sendSuccess(res, note, '와인 노트 색상이 변경되었습니다.');
    } catch (error) {
      console.error('와인 노트 색상 변경 오류:', error);
      if ((error as any).name === 'NotFoundError') {
        res.status(404).json({ success: false, error: 'NOT_FOUND', message: '와인 노트를 찾을 수 없습니다.' });
      } else {
        sendError(res, 500, 'WINE_NOTE_COLOR_ERROR', '와인 노트 색상 변경에 실패했습니다.');
      }
    }
  }
}
