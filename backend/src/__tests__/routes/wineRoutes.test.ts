/**
 * WineRoutes 통합 테스트
 * 
 * Express 라우터의 모든 엔드포인트에 대한 통합 테스트를 작성합니다.
 * Supertest를 사용하여 HTTP 요청/응답을 테스트합니다.
 * Context7 Jest 및 Supertest 모범 사례를 적용합니다.
 */

import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import wineRoutes from '../../routes/wineRoutes';
import { WineService } from '../../services/wineService';
import { errorHandler } from '../../middleware/errorHandler';
import {
  createMockWine,
  mockWines
} from '../mocks/supabaseMock';

// WineService Mock
jest.mock('../../services/wineService');
const MockedWineService = WineService as jest.MockedClass<typeof WineService>;

describe('WineRoutes', () => {
  let app: express.Application;
  let mockWineService: jest.Mocked<WineService>;

  beforeEach(() => {
    // Express 앱 설정
    app = express();
    app.use(express.json());
    app.use('/api/v1/wines', wineRoutes);
    app.use(errorHandler); // Error handler middleware

    // WineService Mock 설정
    mockWineService = {
      getAllWines: jest.fn(),
      getWineById: jest.fn(),
      createWine: jest.fn(),
      updateWine: jest.fn(),
      deleteWine: jest.fn(),
      getLowStockWines: jest.fn()
    } as any;

    // WineService 인스턴스 Mock
    (MockedWineService as any).mockImplementation(() => mockWineService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/wines', () => {
    test('모든 와인 목록을 조회해야 한다', async () => {
      // Given
      const expectedResponse = {
        wines: mockWines,
        pagination: {
          page: 1,
          limit: 20,
          total: 3,
          total_pages: 1
        }
      };
      mockWineService.getAllWines.mockResolvedValue(expectedResponse);

      // When
      const response = await request(app)
        .get('/api/v1/wines')
        .expect(200);

      // Then
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(expectedResponse);
      expect(mockWineService.getAllWines).toHaveBeenCalledWith(
        {},
        { field: 'created_at', order: 'desc' },
        1,
        20
      );
    });

    test('쿼리 파라미터로 필터링된 와인 목록을 조회해야 한다', async () => {
      // Given
      const expectedResponse = {
        wines: [mockWines[0]],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          total_pages: 1
        }
      };
      mockWineService.getAllWines.mockResolvedValue(expectedResponse);

      // When
      const response = await request(app)
        .get('/api/v1/wines')
        .query({
          name: 'Château',
          country_code: 'FR',
          vintage_min: 2015,
          price_max: 2000000,
          low_stock: 'true',
          sort_field: 'price',
          sort_order: 'asc',
          page: '1',
          limit: '10'
        })
        .expect(200);

      // Then
      expect(response.body.success).toBe(true);
      expect(mockWineService.getAllWines).toHaveBeenCalledWith(
        {
          name: 'Château',
          country_code: 'FR',
          vintage_min: 2015,
          price_max: 2000000,
          low_stock: true
        },
        { field: 'price', order: 'asc' },
        1,
        10
      );
    });

    test('서비스 오류 시 500 에러를 반환해야 한다', async () => {
      // Given
      mockWineService.getAllWines.mockRejectedValue(new Error('데이터베이스 오류'));

      // When
      const response = await request(app)
        .get('/api/v1/wines')
        .expect(500);

      // Then
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INTERNAL_ERROR');
      expect(response.body.message).toBe('데이터베이스 오류');
    });
  });

  describe('GET /api/v1/wines/:id', () => {
    test('유효한 ID로 와인을 조회해야 한다', async () => {
      // Given
      const wineId = '1';
      const expectedWine = mockWines[0];
      mockWineService.getWineById.mockResolvedValue(expectedWine);

      // When
      const response = await request(app)
        .get(`/api/v1/wines/${wineId}`)
        .expect(200);

      // Then
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(expectedWine);
      expect(mockWineService.getWineById).toHaveBeenCalledWith(wineId);
    });

    test('존재하지 않는 와인 조회 시 404 에러를 반환해야 한다', async () => {
      // Given
      const wineId = 'nonexistent';
      mockWineService.getWineById.mockRejectedValue(new Error('와인을 찾을 수 없습니다.'));

      // When
      const response = await request(app)
        .get(`/api/v1/wines/${wineId}`)
        .expect(404);

      // Then
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('NOT_FOUND');
      expect(response.body.message).toBe('와인을 찾을 수 없습니다.');
    });

    test('서비스 오류 시 500 에러를 반환해야 한다', async () => {
      // Given
      const wineId = '1';
      mockWineService.getWineById.mockRejectedValue(new Error('데이터베이스 오류'));

      // When
      const response = await request(app)
        .get(`/api/v1/wines/${wineId}`)
        .expect(500);

      // Then
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INTERNAL_ERROR');
    });
  });

  describe('POST /api/v1/wines', () => {
    test('유효한 데이터로 와인을 생성해야 한다', async () => {
      // Given
      const wineData = {
        name: 'Test Wine',
        country_code: 'FR',
        vintage: 2020,
        price: 100000,
        quantity: 10
      };
      const expectedWine = createMockWine(wineData);
      mockWineService.createWine.mockResolvedValue(expectedWine);

      // When
      const response = await request(app)
        .post('/api/v1/wines')
        .send(wineData)
        .expect(201);

      // Then
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(expectedWine);
      expect(response.body.message).toBe('와인이 성공적으로 생성되었습니다.');
      expect(mockWineService.createWine).toHaveBeenCalledWith(wineData);
    });

    test('유효하지 않은 데이터로 요청 시 400 에러를 반환해야 한다', async () => {
      // Given
      const invalidData = {
        name: '', // 빈 문자열
        country_code: 'F', // 잘못된 국가 코드
        vintage: 1800, // 너무 오래된 연도
        price: -100, // 음수 가격
        quantity: -1 // 음수 수량
      };

      // When
      const response = await request(app)
        .post('/api/v1/wines')
        .send(invalidData)
        .expect(400);

      // Then
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('VALIDATION_ERROR');
      expect(response.body.message).toContain('name: 와인명은 필수입니다');
      expect(mockWineService.createWine).not.toHaveBeenCalled();
    });

    test('서비스 오류 시 500 에러를 반환해야 한다', async () => {
      // Given
      const wineData = {
        name: 'Test Wine',
        country_code: 'FR',
        vintage: 2020,
        price: 100000,
        quantity: 10
      };
      mockWineService.createWine.mockRejectedValue(new Error('데이터베이스 오류'));

      // When
      const response = await request(app)
        .post('/api/v1/wines')
        .send(wineData)
        .expect(500);

      // Then
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INTERNAL_ERROR');
    });
  });

  describe('PUT /api/v1/wines/:id', () => {
    test('유효한 데이터로 와인을 업데이트해야 한다', async () => {
      // Given
      const wineId = '1';
      const updateData = {
        name: 'Updated Wine',
        price: 200000
      };
      const expectedWine = createMockWine({ id: wineId, ...updateData });
      mockWineService.updateWine.mockResolvedValue(expectedWine);

      // When
      const response = await request(app)
        .put(`/api/v1/wines/${wineId}`)
        .send(updateData)
        .expect(200);

      // Then
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(expectedWine);
      expect(response.body.message).toBe('와인 정보가 성공적으로 업데이트되었습니다.');
      expect(mockWineService.updateWine).toHaveBeenCalledWith(wineId, updateData);
    });

    test('유효하지 않은 데이터로 요청 시 400 에러를 반환해야 한다', async () => {
      // Given
      const wineId = '1';
      const invalidData = {
        name: '', // 빈 문자열
        price: -100 // 음수 가격
      };

      // When
      const response = await request(app)
        .put(`/api/v1/wines/${wineId}`)
        .send(invalidData)
        .expect(400);

      // Then
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('VALIDATION_ERROR');
      expect(mockWineService.updateWine).not.toHaveBeenCalled();
    });

    test('존재하지 않는 와인 업데이트 시 404 에러를 반환해야 한다', async () => {
      // Given
      const wineId = 'nonexistent';
      const updateData = { name: 'Updated Wine' };
      mockWineService.updateWine.mockRejectedValue(new Error('와인을 찾을 수 없습니다.'));

      // When
      const response = await request(app)
        .put(`/api/v1/wines/${wineId}`)
        .send(updateData)
        .expect(404);

      // Then
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('NOT_FOUND');
      expect(response.body.message).toBe('와인을 찾을 수 없습니다.');
    });

    test('서비스 오류 시 500 에러를 반환해야 한다', async () => {
      // Given
      const wineId = '1';
      const updateData = { name: 'Updated Wine' };
      mockWineService.updateWine.mockRejectedValue(new Error('데이터베이스 오류'));

      // When
      const response = await request(app)
        .put(`/api/v1/wines/${wineId}`)
        .send(updateData)
        .expect(500);

      // Then
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INTERNAL_ERROR');
    });
  });

  describe('DELETE /api/v1/wines/:id', () => {
    test('유효한 ID로 와인을 삭제해야 한다', async () => {
      // Given
      const wineId = '1';
      mockWineService.deleteWine.mockResolvedValue(true);

      // When
      const response = await request(app)
        .delete(`/api/v1/wines/${wineId}`)
        .expect(200);

      // Then
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('와인이 성공적으로 삭제되었습니다.');
      expect(mockWineService.deleteWine).toHaveBeenCalledWith(wineId);
    });

    test('존재하지 않는 와인 삭제 시 404 에러를 반환해야 한다', async () => {
      // Given
      const wineId = 'nonexistent';
      mockWineService.deleteWine.mockRejectedValue(new Error('와인을 찾을 수 없습니다.'));

      // When
      const response = await request(app)
        .delete(`/api/v1/wines/${wineId}`)
        .expect(404);

      // Then
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('NOT_FOUND');
      expect(response.body.message).toBe('와인을 찾을 수 없습니다.');
    });

    test('서비스 오류 시 500 에러를 반환해야 한다', async () => {
      // Given
      const wineId = '1';
      mockWineService.deleteWine.mockRejectedValue(new Error('데이터베이스 오류'));

      // When
      const response = await request(app)
        .delete(`/api/v1/wines/${wineId}`)
        .expect(500);

      // Then
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INTERNAL_ERROR');
    });
  });

  describe('GET /api/v1/wines/alerts/low-stock', () => {
    test('기본 임계값으로 저재고 와인을 조회해야 한다', async () => {
      // Given
      const expectedWines = mockWines.filter(wine => wine.quantity <= 5);
      mockWineService.getLowStockWines.mockResolvedValue(expectedWines);

      // When
      const response = await request(app)
        .get('/api/v1/wines/alerts/low-stock')
        .expect(200);

      // Then
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(expectedWines);
      expect(response.body.message).toBe(`재고가 5개 이하인 와인 ${expectedWines.length}개를 찾았습니다.`);
      expect(mockWineService.getLowStockWines).toHaveBeenCalledWith(5);
    });

    test('사용자 정의 임계값으로 저재고 와인을 조회해야 한다', async () => {
      // Given
      const threshold = 3;
      const expectedWines = mockWines.filter(wine => wine.quantity <= threshold);
      mockWineService.getLowStockWines.mockResolvedValue(expectedWines);

      // When
      const response = await request(app)
        .get('/api/v1/wines/alerts/low-stock')
        .query({ threshold: threshold.toString() })
        .expect(200);

      // Then
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(expectedWines);
      expect(response.body.message).toBe(`재고가 ${threshold}개 이하인 와인 ${expectedWines.length}개를 찾았습니다.`);
      expect(mockWineService.getLowStockWines).toHaveBeenCalledWith(threshold);
    });

    test('서비스 오류 시 500 에러를 반환해야 한다', async () => {
      // Given
      mockWineService.getLowStockWines.mockRejectedValue(new Error('데이터베이스 오류'));

      // When
      const response = await request(app)
        .get('/api/v1/wines/alerts/low-stock')
        .expect(500);

      // Then
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('INTERNAL_ERROR');
    });
  });
});
