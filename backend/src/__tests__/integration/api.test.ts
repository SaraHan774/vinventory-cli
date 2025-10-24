/**
 * 전체 API 통합 테스트
 * 
 * Express 애플리케이션의 전체 API에 대한 E2E 테스트를 작성합니다.
 * 실제 Express 앱을 사용하여 전체 요청/응답 플로우를 테스트합니다.
 * Context7 Jest 및 Supertest 모범 사례를 적용합니다.
 */

import { describe, expect, test, beforeAll, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import wineRoutes from '../../routes/wineRoutes';
import { errorHandler, notFoundHandler } from '../../middleware/errorHandler';
import { 
  createSupabaseMock
} from '../mocks/supabaseMock';

// Supabase Mock 설정
jest.mock('../../config/supabase', () => ({
  supabase: createSupabaseMock()
}));

describe('API Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    // Express 앱 설정 (실제 앱과 동일한 구조)
    app = express();
    
    // 미들웨어 설정
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false
    }));
    
    app.use(cors({
      origin: 'http://localhost:5174',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));
    
    app.use(morgan('combined'));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // 헬스 체크 엔드포인트
    app.get('/health', async (_req, res) => {
      try {
        const isConnected = true; // Mock 연결 상태
        const healthStatus = {
          status: isConnected ? 'healthy' : 'unhealthy',
          timestamp: new Date().toISOString(),
          services: {
            database: isConnected ? 'connected' : 'disconnected',
            server: 'running'
          },
          version: '1.0.0'
        };
        res.status(isConnected ? 200 : 503).json(healthStatus);
      } catch (error) {
        res.status(503).json({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: 'Health check failed'
        });
      }
    });

    // API 정보 엔드포인트
    app.get('/api', (_req, res) => {
      res.json({
        name: 'Vinventory API',
        version: '1.0.0',
        description: 'TypeScript Express API server with Supabase integration',
        endpoints: {
          health: '/health',
          wines: '/api/v1/wines',
          docs: '/api/docs'
        },
        timestamp: new Date().toISOString()
      });
    });

    // API 라우트 설정
    app.use('/api/v1/wines', wineRoutes);

    // 에러 핸들러
    app.use(notFoundHandler);
    app.use(errorHandler);
  });

  beforeEach(() => {
    // Mock 초기화
    jest.clearAllMocks();
  });

  describe('Health Check', () => {
    test('헬스 체크 엔드포인트가 정상적으로 응답해야 한다', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.services.database).toBe('connected');
      expect(response.body.services.server).toBe('running');
      expect(response.body.version).toBe('1.0.0');
    });
  });

  describe('API Information', () => {
    test('API 정보 엔드포인트가 정상적으로 응답해야 한다', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body.name).toBe('Vinventory API');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.endpoints).toEqual({
        health: '/health',
        wines: '/api/v1/wines',
        docs: '/api/docs'
      });
    });
  });

  describe('Wine API End-to-End', () => {
    test('전체 와인 CRUD 플로우가 정상적으로 작동해야 한다', async () => {
      // 1. 와인 목록 조회 (초기 상태)
      const listResponse = await request(app)
        .get('/api/v1/wines')
        .expect(200);

      expect(listResponse.body.success).toBe(true);
      expect(listResponse.body.data.wines).toBeDefined();
      expect(listResponse.body.data.pagination).toBeDefined();

      // 2. 새 와인 생성
      const newWine = {
        name: 'Integration Test Wine',
        country_code: 'FR',
        vintage: 2023,
        price: 50000,
        quantity: 5
      };

      const createResponse = await request(app)
        .post('/api/v1/wines')
        .send(newWine)
        .expect(201);

      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.data.name).toBe(newWine.name);
      expect(createResponse.body.message).toBe('와인이 성공적으로 생성되었습니다.');

      const createdWineId = createResponse.body.data.id;

      // 3. 생성된 와인 조회
      const getResponse = await request(app)
        .get(`/api/v1/wines/${createdWineId}`)
        .expect(200);

      expect(getResponse.body.success).toBe(true);
      expect(getResponse.body.data.name).toBe(newWine.name);

      // 4. 와인 정보 업데이트
      const updateData = {
        name: 'Updated Integration Test Wine',
        price: 75000
      };

      const updateResponse = await request(app)
        .put(`/api/v1/wines/${createdWineId}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data.name).toBe(updateData.name);
      expect(updateResponse.body.data.price).toBe(updateData.price);
      expect(updateResponse.body.message).toBe('와인 정보가 성공적으로 업데이트되었습니다.');

      // 5. 와인 삭제
      const deleteResponse = await request(app)
        .delete(`/api/v1/wines/${createdWineId}`)
        .expect(200);

      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message).toBe('와인이 성공적으로 삭제되었습니다.');
    });

    test('저재고 알림 기능이 정상적으로 작동해야 한다', async () => {
      const response = await request(app)
        .get('/api/v1/wines/alerts/low-stock')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.message).toContain('재고가');
    });

    test('잘못된 엔드포인트 요청 시 404 에러를 반환해야 한다', async () => {
      const response = await request(app)
        .get('/api/v1/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('NOT_FOUND');
      expect(response.body.message).toContain('요청한 리소스를 찾을 수 없습니다');
    });
  });

  describe('Error Handling', () => {
    test('잘못된 JSON 요청 시 400 에러를 반환해야 한다', async () => {
      const response = await request(app)
        .post('/api/v1/wines')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      // Express JSON 파서가 잘못된 JSON을 처리하는 방식에 따라 다를 수 있음
      expect(response.status).toBe(400);
    });

    test('존재하지 않는 와인 ID로 조회 시 404 에러를 반환해야 한다', async () => {
      const response = await request(app)
        .get('/api/v1/wines/nonexistent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('NOT_FOUND');
    });
  });

  describe('CORS and Security Headers', () => {
    test('CORS 헤더가 올바르게 설정되어야 한다', async () => {
      const response = await request(app)
        .get('/api/v1/wines')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5174');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    test('보안 헤더가 올바르게 설정되어야 한다', async () => {
      const response = await request(app)
        .get('/api/v1/wines')
        .expect(200);

      // Helmet이 설정한 보안 헤더들 확인
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(response.headers['x-xss-protection']).toBe('0');
    });
  });

  describe('Performance and Load', () => {
    test('동시 요청 처리가 정상적으로 작동해야 한다', async () => {
      const requests = Array.from({ length: 10 }, () =>
        request(app).get('/api/v1/wines')
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });

    test('큰 페이로드 요청이 정상적으로 처리되어야 한다', async () => {
      const largeWineData = {
        name: 'A'.repeat(1000), // 긴 이름
        country_code: 'FR',
        vintage: 2023,
        price: 100000,
        quantity: 100
      };

      const response = await request(app)
        .post('/api/v1/wines')
        .send(largeWineData)
        .expect(201);

      expect(response.body.success).toBe(true);
    });
  });
});
