import { Router, Request, Response } from 'express';
import { WineService } from '../services/wineService';
import { ApiResponse, ErrorResponse, WineSearchFilter, UpdateWineRequest } from '../types/wine';
import { z } from 'zod';

const router = Router();
const wineService = new WineService();

/**
 * 와인 생성 요청 스키마
 */
const createWineSchema = z.object({
  name: z.string().min(1, '와인명은 필수입니다'),
  country_code: z.string().length(2, '국가 코드는 2자리여야 합니다'),
  vintage: z.number().int().min(1800).max(new Date().getFullYear() + 1),
  price: z.number().positive('가격은 양수여야 합니다'),
  quantity: z.number().int().min(0, '수량은 0 이상이어야 합니다')
});

/**
 * 와인 업데이트 요청 스키마
 */
const updateWineSchema = z.object({
  name: z.string().min(1).optional(),
  country_code: z.string().length(2).optional(),
  vintage: z.number().int().min(1800).max(new Date().getFullYear() + 1).optional(),
  price: z.number().positive().optional(),
  quantity: z.number().int().min(0).optional()
});

/**
 * GET /api/v1/wines
 * 모든 와인 목록 조회
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      country_code,
      vintage_min,
      vintage_max,
      price_min,
      price_max,
      low_stock,
      sort_field = 'created_at',
      sort_order = 'desc',
      page = '1',
      limit = '20'
    } = req.query;

    const filter: WineSearchFilter = {
      name: name as string,
      country_code: country_code as string,
      vintage_min: vintage_min ? parseInt(vintage_min as string) : undefined,
      vintage_max: vintage_max ? parseInt(vintage_max as string) : undefined,
      price_min: price_min ? parseFloat(price_min as string) : undefined,
      price_max: price_max ? parseFloat(price_max as string) : undefined,
      low_stock: low_stock === 'true'
    };

    const sort = {
      field: sort_field as any,
      order: sort_order as 'asc' | 'desc'
    };

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const result = await wineService.getAllWines(filter, sort, pageNum, limitNum);

    const response: ApiResponse = {
      success: true,
      data: result
    };

    res.json(response);
  } catch (error) {
    console.error('와인 목록 조회 오류:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : '서버 내부 오류가 발생했습니다.'
    };
    res.status(500).json(errorResponse);
  }
});

/**
 * GET /api/v1/wines/:id
 * 특정 와인 조회
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const wine = await wineService.getWineById(id);

    const response: ApiResponse = {
      success: true,
      data: wine
    };

    res.json(response);
  } catch (error) {
    console.error('와인 조회 오류:', error);
    
    let status = 500;
    let message = '서버 내부 오류가 발생했습니다.';

    if (error instanceof Error) {
      if (error.message.includes('찾을 수 없습니다')) {
        status = 404;
        message = error.message;
      } else {
        message = error.message;
      }
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: status === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR',
      message
    };

    res.status(status).json(errorResponse);
  }
});

/**
 * POST /api/v1/wines
 * 새 와인 생성
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createWineSchema.parse(req.body);
    const wine = await wineService.createWine(validatedData);

    const response: ApiResponse = {
      success: true,
      data: wine,
      message: '와인이 성공적으로 생성되었습니다.'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('와인 생성 오류:', error);
    
    if (error instanceof z.ZodError) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'VALIDATION_ERROR',
        message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      };
      res.status(400).json(errorResponse);
      return;
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : '서버 내부 오류가 발생했습니다.'
    };
    res.status(500).json(errorResponse);
  }
});

/**
 * PUT /api/v1/wines/:id
 * 와인 정보 업데이트
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateWineSchema.parse(req.body);
    
    const wine = await wineService.updateWine(id, validatedData as UpdateWineRequest);

    const response: ApiResponse = {
      success: true,
      data: wine,
      message: '와인 정보가 성공적으로 업데이트되었습니다.'
    };

    res.json(response);
  } catch (error) {
    console.error('와인 업데이트 오류:', error);
    
    if (error instanceof z.ZodError) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'VALIDATION_ERROR',
        message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      };
      res.status(400).json(errorResponse);
      return;
    }

    let status = 500;
    let message = '서버 내부 오류가 발생했습니다.';

    if (error instanceof Error) {
      if (error.message.includes('찾을 수 없습니다')) {
        status = 404;
        message = error.message;
      } else {
        message = error.message;
      }
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: status === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR',
      message
    };

    res.status(status).json(errorResponse);
  }
});

/**
 * DELETE /api/v1/wines/:id
 * 와인 삭제
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await wineService.deleteWine(id);

    const response: ApiResponse = {
      success: true,
      message: '와인이 성공적으로 삭제되었습니다.'
    };

    res.json(response);
  } catch (error) {
    console.error('와인 삭제 오류:', error);
    
    let status = 500;
    let message = '서버 내부 오류가 발생했습니다.';

    if (error instanceof Error) {
      if (error.message.includes('찾을 수 없습니다')) {
        status = 404;
        message = error.message;
      } else {
        message = error.message;
      }
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: status === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR',
      message
    };

    res.status(status).json(errorResponse);
  }
});

/**
 * GET /api/v1/wines/alerts/low-stock
 * 저재고 와인 목록 조회
 */
router.get('/alerts/low-stock', async (req: Request, res: Response) => {
  try {
    const { threshold = '5' } = req.query;
    const thresholdNum = parseInt(threshold as string);
    
    const wines = await wineService.getLowStockWines(thresholdNum);

    const response: ApiResponse = {
      success: true,
      data: wines,
      message: `재고가 ${thresholdNum}개 이하인 와인 ${wines.length}개를 찾았습니다.`
    };

    res.json(response);
  } catch (error) {
    console.error('저재고 와인 조회 오류:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : '서버 내부 오류가 발생했습니다.'
    };
    res.status(500).json(errorResponse);
  }
});

export default router;
