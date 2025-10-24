/**
 * Wine Controller
 *
 * Handles HTTP request/response logic for wine-related endpoints.
 * Delegates business logic to the WineService and uses response utilities
 * for consistent API responses.
 */

import { Request, Response, NextFunction } from 'express';
import { WineService } from '../services/wineService';
import { sendSuccess, sendCreated } from '../utils/responseUtils';
import {
  CreateWineRequest,
  UpdateWineRequest,
  WineSearchFilter,
  WineSortOptions
} from '../types/wine';

/**
 * Wine Controller Class
 *
 * All methods are async and use asyncHandler in routes to catch errors.
 * Errors are automatically propagated to the global error handler.
 */
export class WineController {
  private wineService: WineService;

  constructor() {
    this.wineService = new WineService();
  }

  /**
   * GET /api/v1/wines
   * Get all wines with optional filtering, sorting, and pagination
   */
  async getAllWines(req: Request, res: Response, next: NextFunction): Promise<void> {
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
        page = 1,
        limit = 20
      } = req.query;

      const filter: WineSearchFilter = {};
      if (name) filter.name = name as string;
      if (country_code) filter.country_code = country_code as string;
      if (vintage_min) filter.vintage_min = Number(vintage_min);
      if (vintage_max) filter.vintage_max = Number(vintage_max);
      if (price_min) filter.price_min = Number(price_min);
      if (price_max) filter.price_max = Number(price_max);
      if (low_stock === 'true') filter.low_stock = true;

      const sort: WineSortOptions = {
        field: sort_field as any,
        order: sort_order as 'asc' | 'desc'
      };

      const result = await this.wineService.getAllWines(
        filter,
        sort,
        Number(page),
        Number(limit)
      );

      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/wines/:id
   * Get a specific wine by ID
   */
  async getWineById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const wine = await this.wineService.getWineById(id);

      sendSuccess(res, wine);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/wines
   * Create a new wine
   */
  async createWine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const wineData: CreateWineRequest = req.body;
      const wine = await this.wineService.createWine(wineData);

      sendCreated(res, wine, '와인이 성공적으로 생성되었습니다.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/wines/:id
   * Update an existing wine
   */
  async updateWine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const wineData: UpdateWineRequest = req.body;

      const wine = await this.wineService.updateWine(id, wineData);

      sendSuccess(res, wine, '와인 정보가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/wines/:id
   * Delete a wine
   */
  async deleteWine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.wineService.deleteWine(id);

      sendSuccess(res, undefined, '와인이 성공적으로 삭제되었습니다.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/wines/alerts/low-stock
   * Get wines with low stock levels
   */
  async getLowStockWines(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { threshold = 5 } = req.query;
      const thresholdNum = Number(threshold);

      const wines = await this.wineService.getLowStockWines(thresholdNum);

      sendSuccess(
        res,
        wines,
        `재고가 ${thresholdNum}개 이하인 와인 ${wines.length}개를 찾았습니다.`
      );
    } catch (error) {
      next(error);
    }
  }
}
