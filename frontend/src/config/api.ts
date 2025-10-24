/**
 * API 설정 및 환경 변수 관리
 * 
 * Backend API와의 통신을 위한 설정을 관리합니다.
 */

// API 기본 설정
export const API_CONFIG = {
  // Backend API URL (환경 변수에서 가져오거나 기본값 사용)
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8590',
  
  // API 버전
  VERSION: 'v1',
  
  // 타임아웃 설정 (밀리초)
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  
  // 디버그 모드
  DEBUG: import.meta.env.VITE_DEBUG === 'true' || import.meta.env.DEV,
  
  // 환경
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
} as const;

// API 엔드포인트 설정
export const API_ENDPOINTS = {
  // 기본 엔드포인트
  BASE: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`,
  
  // 와인 관련 엔드포인트
  WINES: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}/wines`,
  
  // 헬스 체크
  HEALTH: `${API_CONFIG.BASE_URL}/health`,
  
  // API 정보
  INFO: `${API_CONFIG.BASE_URL}/api`,
} as const;

// 클라이언트 타입 설정
export const CLIENT_CONFIG = {
  TYPE: 'web',
  VERSION: '2.0.0',
  USER_AGENT: 'Vinventory-Web/2.0.0',
} as const;

// 디버그 로깅 함수
export const debugLog = (message: string, data?: any) => {
  if (API_CONFIG.DEBUG) {
    console.log(`🔍 [API Debug] ${message}`, data || '');
  }
};

// API 연결 상태 확인
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH);
    return response.ok;
  } catch (error) {
    debugLog('API 연결 실패', error);
    return false;
  }
};

export default API_CONFIG;
