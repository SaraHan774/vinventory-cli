/**
 * Backend API 클라이언트
 * 
 * Kotlin Backend API와 통신하기 위한 HTTP 클라이언트입니다.
 * 다중 클라이언트 지원을 위한 통합된 API 엔드포인트를 제공합니다.
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { Wine, CreateWineRequest, UpdateWineRequest, UpdateWineQuantityRequest } from '../types/wine';

// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8590';
const API_VERSION = 'v1';

/**
 * API 클라이언트 인스턴스 생성
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Type': 'web',
      'X-Client-Version': '2.0.0',
    },
  });

  // 요청 인터셉터
  client.interceptors.request.use(
    (config) => {
      console.log(`🚀 API 요청: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('❌ API 요청 오류:', error);
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  client.interceptors.response.use(
    (response) => {
      console.log(`✅ API 응답: ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error('❌ API 응답 오류:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return client;
};

const apiClient = createApiClient();

/**
 * 와인 관련 API 서비스
 * 
 * Backend API와 통신하여 와인 데이터를 관리합니다.
 */
export class WineApiService {
  /**
   * 모든 와인 조회
   */
  static async getAllWines(): Promise<Wine[]> {
    const response: AxiosResponse<{ success: boolean; data: { wines: Wine[] } }> = await apiClient.get('/wines');
    return response.data.data.wines;
  }

  /**
   * 특정 와인 조회
   */
  static async getWineById(id: string): Promise<Wine> {
    const response: AxiosResponse<{ success: boolean; data: Wine }> = await apiClient.get(`/wines/${id}`);
    return response.data.data;
  }

  /**
   * 와인 생성
   */
  static async createWine(wineData: CreateWineRequest): Promise<Wine> {
    const response: AxiosResponse<{ success: boolean; data: Wine }> = await apiClient.post('/wines', wineData);
    return response.data.data;
  }

  /**
   * 와인 업데이트
   */
  static async updateWine(id: string, wineData: UpdateWineRequest): Promise<Wine> {
    const response: AxiosResponse<{ success: boolean; data: Wine }> = await apiClient.put(`/wines/${id}`, wineData);
    return response.data.data;
  }

  /**
   * 와인 삭제
   */
  static async deleteWine(id: string): Promise<void> {
    await apiClient.delete(`/wines/${id}`);
  }

  /**
   * 와인 수량 업데이트
   */
  static async updateWineQuantity(id: string, quantityData: UpdateWineQuantityRequest): Promise<Wine> {
    const response: AxiosResponse<{ success: boolean; data: Wine }> = await apiClient.put(`/wines/${id}/quantity`, quantityData);
    return response.data.data;
  }

  /**
   * 이름으로 와인 검색
   */
  static async searchWines(query: string): Promise<Wine[]> {
    const response: AxiosResponse<{ success: boolean; data: Wine[] }> = await apiClient.get('/wines/search', {
      params: { query }
    });
    return response.data.data;
  }

  /**
   * 빈티지 범위로 와인 필터링
   */
  static async filterByVintageRange(startYear: number, endYear: number): Promise<Wine[]> {
    const response: AxiosResponse<{ success: boolean; data: Wine[] }> = await apiClient.get('/wines/filter', {
      params: { 
        vintageStart: startYear, 
        vintageEnd: endYear 
      }
    });
    return response.data.data;
  }

  /**
   * 가격 범위로 와인 필터링
   */
  static async filterByPriceRange(minPrice: number, maxPrice: number): Promise<Wine[]> {
    const response: AxiosResponse<{ success: boolean; data: Wine[] }> = await apiClient.get('/wines/filter', {
      params: { 
        minPrice, 
        maxPrice 
      }
    });
    return response.data.data;
  }

  /**
   * 국가 코드로 와인 필터링
   */
  static async filterByCountry(countryCode: string): Promise<Wine[]> {
    const response: AxiosResponse<{ success: boolean; data: Wine[] }> = await apiClient.get('/wines/filter', {
      params: { country: countryCode }
    });
    return response.data.data;
  }

  /**
   * 재고 부족 와인 조회
   */
  static async getLowStockWines(threshold: number = 5): Promise<Wine[]> {
    const response: AxiosResponse<{ success: boolean; data: Wine[] }> = await apiClient.get('/wines/low-stock', {
      params: { threshold }
    });
    return response.data.data;
  }
}

/**
 * API 헬스 체크
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.status === 200;
  } catch (error) {
    console.error('API 헬스 체크 실패:', error);
    return false;
  }
};

/**
 * API 연결 상태 확인
 */
export const checkApiConnection = async (): Promise<{ connected: boolean; message: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api`);
    return {
      connected: true,
      message: `API 연결 성공: ${response.data.message}`
    };
  } catch (error) {
    return {
      connected: false,
      message: `API 연결 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
    };
  }
};

export default WineApiService;
