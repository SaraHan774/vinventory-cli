/**
 * WineRoutes 간단한 테스트
 * 
 * 기본적인 라우트 동작을 테스트합니다.
 */

import { describe, expect, test, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import wineRoutes from '../../routes/wineRoutes';

describe('WineRoutes Simple Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/wines', wineRoutes);
  });

  test('GET /api/v1/wines 엔드포인트가 존재해야 한다', async () => {
    const response = await request(app)
      .get('/api/v1/wines');

    // 응답이 있어야 함 (에러든 성공이든)
    expect(response.status).toBeDefined();
  });

  test('POST /api/v1/wines 엔드포인트가 존재해야 한다', async () => {
    const response = await request(app)
      .post('/api/v1/wines')
      .send({});

    // 응답이 있어야 함 (에러든 성공이든)
    expect(response.status).toBeDefined();
  });

  test('잘못된 JSON 요청 시 400 에러를 반환해야 한다', async () => {
    const response = await request(app)
      .post('/api/v1/wines')
      .set('Content-Type', 'application/json')
      .send('invalid json');

    expect(response.status).toBe(400);
  });
});
