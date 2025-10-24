/**
 * Validation Middleware
 *
 * Provides reusable validation middleware using Zod schemas.
 * Automatically validates request body, params, or query and
 * throws ValidationError on failure.
 */

import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError } from '../errors/HttpErrors';

/**
 * Request validation target
 */
type ValidationTarget = 'body' | 'params' | 'query';

/**
 * Create validation middleware for a Zod schema
 *
 * @param schema Zod schema to validate against
 * @param target Request property to validate (body, params, or query)
 * @returns Express middleware function
 */
export function validate(
  schema: z.ZodSchema,
  target: ValidationTarget = 'body'
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Validate the target property against the schema
      const validated = schema.parse(req[target]);

      // Replace the request property with validated data
      req[target] = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into a readable message
        const message = error.errors
          .map(e => `${e.path.join('.')}: ${e.message}`)
          .join(', ');

        next(new ValidationError(message, error.errors));
      } else {
        next(error);
      }
    }
  };
}

/**
 * Common Zod Schemas for Wine API
 */

/**
 * Wine creation schema
 */
export const createWineSchema = z.object({
  name: z.string().min(1, '와인명은 필수입니다'),
  country_code: z.string().length(2, '국가 코드는 2자리여야 합니다'),
  vintage: z.number().int().min(1800).max(new Date().getFullYear() + 1),
  price: z.number().positive('가격은 양수여야 합니다'),
  quantity: z.number().int().min(0, '수량은 0 이상이어야 합니다')
});

/**
 * Wine update schema
 * All fields are optional for partial updates
 */
export const updateWineSchema = z.object({
  name: z.string().min(1).optional(),
  country_code: z.string().length(2).optional(),
  vintage: z.number().int().min(1800).max(new Date().getFullYear() + 1).optional(),
  price: z.number().positive().optional(),
  quantity: z.number().int().min(0).optional()
}).refine(
  data => Object.keys(data).length > 0,
  { message: '최소 하나의 필드를 제공해야 합니다' }
);

/**
 * Wine ID parameter schema
 * Uses string validation instead of UUID to allow flexibility in tests
 * Supabase will validate UUID format at the database level
 */
export const wineIdSchema = z.object({
  id: z.string().min(1, 'ID는 필수입니다')
});

/**
 * Wine search query schema
 */
export const wineSearchSchema = z.object({
  name: z.string().optional(),
  country_code: z.string().length(2).optional(),
  vintage_min: z.string().transform(val => parseInt(val)).pipe(z.number().int()).optional(),
  vintage_max: z.string().transform(val => parseInt(val)).pipe(z.number().int()).optional(),
  price_min: z.string().transform(val => parseFloat(val)).pipe(z.number()).optional(),
  price_max: z.string().transform(val => parseFloat(val)).pipe(z.number()).optional(),
  low_stock: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  sort_field: z.enum(['name', 'country_code', 'vintage', 'price', 'quantity', 'created_at', 'updated_at']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  page: z.string().transform(val => parseInt(val)).pipe(z.number().int().positive()).default('1'),
  limit: z.string().transform(val => parseInt(val)).pipe(z.number().int().positive().max(100)).default('20')
}).optional();

/**
 * Low stock threshold query schema
 * Makes threshold optional and provides default value
 */
export const lowStockQuerySchema = z.object({
  threshold: z.string().optional().transform(val => val ? parseInt(val) : 5).pipe(z.number().int().positive())
}).optional();

/**
 * Wine note validation schema
 */
export const wineNoteSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다.').max(255, '제목은 255자를 초과할 수 없습니다.'),
  content: z.string().max(10000, '내용은 10000자를 초과할 수 없습니다.').nullable().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '올바른 HEX 색상 코드를 입력해주세요.').optional(),
  is_pinned: z.boolean().optional()
});

/**
 * Wine note update validation schema (모든 필드가 선택적)
 */
export const wineNoteUpdateSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다.').max(255, '제목은 255자를 초과할 수 없습니다.').optional(),
  content: z.string().max(10000, '내용은 10000자를 초과할 수 없습니다.').nullable().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '올바른 HEX 색상 코드를 입력해주세요.').optional(),
  is_pinned: z.boolean().optional()
});

/**
 * Wine note pin toggle validation schema
 */
export const wineNotePinSchema = z.object({
  is_pinned: z.boolean()
});

/**
 * Wine note color change validation schema
 */
export const wineNoteColorSchema = z.object({
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '올바른 HEX 색상 코드를 입력해주세요.')
});

// 와인 노트 검증 미들웨어
export const validateWineNote = validate(wineNoteSchema, 'body');
export const validateWineNoteUpdate = validate(wineNoteUpdateSchema, 'body');
export const validateWineNotePin = validate(wineNotePinSchema, 'body');
export const validateWineNoteColor = validate(wineNoteColorSchema, 'body');
