import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { checkSupabaseConnection, logEnvironmentInfo } from './config/supabase';
import wineRoutes from './routes/wineRoutes';
import wineNoteRoutes from './routes/wineNoteRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// 환경 변수 로드
dotenv.config();

/**
 * Express 애플리케이션 설정
 * 
 * Context7 분석 결과를 바탕으로 Express.js와 TypeScript를 사용한
 * Supabase 연동 백엔드 서버를 구성합니다.
 */
const app = express();
const PORT = process.env.PORT || 8590;

// 보안 미들웨어 (Context7 권장)
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

// CORS 설정 (개발 환경용 - 모든 origin 허용)
app.use(cors({
  origin: true, // 모든 origin 허용
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-client-type', 'x-client-version', 'x-user-agent']
}));

// 로깅 미들웨어 (Context7 권장)
app.use(morgan('combined'));

// JSON 파싱 미들웨어
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 헬스 체크 엔드포인트
app.get('/health', async (_req, res) => {
  try {
    const isConnected = await checkSupabaseConnection();
    
    const healthStatus = {
      status: isConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: isConnected ? 'connected' : 'disconnected',
        server: 'running'
      },
      version: process.env.npm_package_version || '1.0.0'
    };

    res.status(isConnected ? 200 : 503).json(healthStatus);
  } catch (error) {
    console.error('헬스 체크 오류:', error);
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
app.use('/api/v1/wines', wineNoteRoutes);

// 404 핸들러 (Context7 권장 순서)
app.use(notFoundHandler);

// 글로벌 에러 핸들러 (Context7 권장 순서)
app.use(errorHandler);

/**
 * 서버 시작 함수
 * 
 * Supabase 연결을 확인하고 Express 서버를 시작합니다.
 */
async function startServer(): Promise<void> {
  try {
    console.log('🚀 TypeScript Express 서버 시작 중...');
    
    // 환경 정보 출력
    logEnvironmentInfo();
    
    // Supabase 연결 확인
    console.log('🔍 Supabase 연결 확인 중...');
    const isConnected = await checkSupabaseConnection();
    
    if (!isConnected) {
      console.warn('⚠️  Supabase 연결에 실패했습니다. 환경 변수를 확인해주세요.');
      console.warn('   SUPABASE_URL과 SUPABASE_ANON_KEY를 .env 파일에 설정해주세요.');
    }
    
    // 서버 시작
    app.listen(PORT, () => {
      console.log('✅ 서버가 성공적으로 시작되었습니다!');
      console.log(`   📍 URL: http://localhost:${PORT}`);
      console.log(`   🔍 Health: http://localhost:${PORT}/health`);
      console.log(`   📚 API: http://localhost:${PORT}/api`);
      console.log(`   🍷 Wines: http://localhost:${PORT}/api/v1/wines`);
      console.log(`   🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
}

// Graceful shutdown 처리
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM 신호를 받았습니다. 서버를 종료합니다...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT 신호를 받았습니다. 서버를 종료합니다...');
  process.exit(0);
});

// 처리되지 않은 예외 처리
process.on('uncaughtException', (error) => {
  console.error('🚨 처리되지 않은 예외:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, _promise) => {
  console.error('🚨 처리되지 않은 Promise 거부:', reason);
  process.exit(1);
});

// 서버 시작
startServer();
