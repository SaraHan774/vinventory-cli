/**
 * 와인 노트 라우트
 * 
 * Google Keep 스타일의 와인 노트 API 엔드포인트를 정의합니다.
 */

import { Router } from 'express';
import { WineNoteController } from '../controllers/wineNoteController';
import { 
  validateWineNote, 
  validateWineNoteUpdate, 
  validateWineNotePin, 
  validateWineNoteColor 
} from '../middleware/validation';

const router = Router();
const wineNoteController = new WineNoteController();

/**
 * @route GET /api/v1/wines/:wineId/notes
 * @desc 특정 와인의 모든 노트 조회
 * @access Public
 */
router.get('/:wineId/notes', wineNoteController.getWineNotes.bind(wineNoteController));

/**
 * @route GET /api/v1/wines/:wineId/notes/:id
 * @desc 특정 노트 조회
 * @access Public
 */
router.get('/:wineId/notes/:id', wineNoteController.getWineNoteById.bind(wineNoteController));

/**
 * @route POST /api/v1/wines/:wineId/notes
 * @desc 새 와인 노트 생성
 * @access Public
 */
router.post('/:wineId/notes', validateWineNote, wineNoteController.createWineNote.bind(wineNoteController));

/**
 * @route PUT /api/v1/wines/:wineId/notes/:id
 * @desc 와인 노트 업데이트
 * @access Public
 */
router.put('/:wineId/notes/:id', validateWineNoteUpdate, wineNoteController.updateWineNote.bind(wineNoteController));

/**
 * @route DELETE /api/v1/wines/:wineId/notes/:id
 * @desc 와인 노트 삭제
 * @access Public
 */
router.delete('/:wineId/notes/:id', wineNoteController.deleteWineNote.bind(wineNoteController));

/**
 * @route PATCH /api/v1/wines/:wineId/notes/:id/pin
 * @desc 와인 노트 고정/고정 해제
 * @access Public
 */
router.patch('/:wineId/notes/:id/pin', validateWineNotePin, wineNoteController.togglePinWineNote.bind(wineNoteController));

/**
 * @route PATCH /api/v1/wines/:wineId/notes/:id/color
 * @desc 와인 노트 색상 변경
 * @access Public
 */
router.patch('/:wineId/notes/:id/color', validateWineNoteColor, wineNoteController.changeWineNoteColor.bind(wineNoteController));

export default router;
