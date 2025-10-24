/**
 * Wine Routes
 *
 * Defines all wine-related API endpoints.
 * Routes are clean and declarative, delegating to controllers and middleware.
 */

import { Router } from 'express';
import { WineController } from '../controllers/wineController';
import { asyncHandler } from '../middleware/errorHandler';
import {
  validate,
  createWineSchema,
  updateWineSchema,
  wineIdSchema,
  lowStockQuerySchema
} from '../middleware/validation';

const router = Router();

// Lazy instantiation of controller to support mocking in tests
const getController = () => new WineController();

/**
 * GET /api/v1/wines/alerts/low-stock
 * Get wines with low stock levels
 *
 * IMPORTANT: This route must come BEFORE /:id to avoid matching "alerts" as an ID
 */
router.get(
  '/alerts/low-stock',
  validate(lowStockQuerySchema, 'query'),
  asyncHandler((req, res, next) => getController().getLowStockWines(req, res, next))
);

/**
 * GET /api/v1/wines
 * Get all wines with optional filtering, sorting, and pagination
 */
router.get(
  '/',
  asyncHandler((req, res, next) => getController().getAllWines(req, res, next))
);

/**
 * GET /api/v1/wines/:id
 * Get a specific wine by ID
 */
router.get(
  '/:id',
  validate(wineIdSchema, 'params'),
  asyncHandler((req, res, next) => getController().getWineById(req, res, next))
);

/**
 * POST /api/v1/wines
 * Create a new wine
 */
router.post(
  '/',
  validate(createWineSchema, 'body'),
  asyncHandler((req, res, next) => getController().createWine(req, res, next))
);

/**
 * PUT /api/v1/wines/:id
 * Update an existing wine
 */
router.put(
  '/:id',
  validate(wineIdSchema, 'params'),
  validate(updateWineSchema, 'body'),
  asyncHandler((req, res, next) => getController().updateWine(req, res, next))
);

/**
 * DELETE /api/v1/wines/:id
 * Delete a wine
 */
router.delete(
  '/:id',
  validate(wineIdSchema, 'params'),
  asyncHandler((req, res, next) => getController().deleteWine(req, res, next))
);

export default router;
