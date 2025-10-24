/**
 * WineService 단위 테스트
 * 
 * WineService의 모든 메서드에 대한 단위 테스트를 작성합니다.
 * Supabase Mock을 사용하여 데이터베이스 의존성을 제거합니다.
 * Context7 Jest 모범 사례를 적용합니다.
 */

import { describe, expect, beforeEach, jest } from '@jest/globals';
import { WineService } from '../../services/wineService';
import { 
  createSupabaseMock, 
  mockSuccessfulResponse, 
  mockErrorResponse, 
  createMockWine,
  mockWines 
} from '../mocks/supabaseMock';
import { WineSearchFilter, WineSortOptions } from '../../types/wine';

// Supabase Mock 설정
const mockSupabaseInstance = createSupabaseMock();
jest.mock('../../config/supabase', () => ({
  supabase: mockSupabaseInstance
}));

describe('WineService', () => {
  let wineService: WineService;
  let mockSupabase: any;

  beforeEach(() => {
    // 각 테스트마다 새로운 인스턴스 생성
    wineService = new WineService();
    mockSupabase = mockSupabaseInstance;
    
    // Mock 초기화
    jest.clearAllMocks();
  });

  describe('getAllWines', () => {
    it('기본 파라미터로 모든 와인을 조회해야 한다', async () => {
      // Given
      const expectedWines = mockWines;
      const mockQuery = mockSupabase.from().select();
      mockQuery.range.mockResolvedValue(mockSuccessfulResponse(expectedWines, 3));

      // When
      const result = await wineService.getAllWines();

      // Then
      expect(mockSupabase.from).toHaveBeenCalledWith('wines');
      expect(mockQuery.select).toHaveBeenCalledWith('*', { count: 'exact' });
      expect(mockQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockQuery.range).toHaveBeenCalledWith(0, 19);
      expect(result.wines).toEqual(expectedWines);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
    });

    it('필터와 정렬 옵션을 적용하여 와인을 조회해야 한다', async () => {
      // Given
      const filter: WineSearchFilter = {
        name: 'Château',
        country_code: 'FR',
        vintage_min: 2015,
        price_max: 2000000
      };
      const sort: WineSortOptions = { field: 'price', order: 'asc' };
      const expectedWines = [mockWines[0]];
      const mockQuery = mockSupabase.from().select();
      mockQuery.range.mockResolvedValue(mockSuccessfulResponse(expectedWines, 1));

      // When
      const result = await wineService.getAllWines(filter, sort, 1, 10);

      // Then
      expect(mockQuery.ilike).toHaveBeenCalledWith('name', '%Château%');
      expect(mockQuery.eq).toHaveBeenCalledWith('country_code', 'FR');
      expect(mockQuery.gte).toHaveBeenCalledWith('vintage', 2015);
      expect(mockQuery.lte).toHaveBeenCalledWith('price', 2000000);
      expect(mockQuery.order).toHaveBeenCalledWith('price', { ascending: true });
      expect(result.wines).toEqual(expectedWines);
    });

    it('저재고 필터를 적용해야 한다', async () => {
      // Given
      const filter: WineSearchFilter = { low_stock: true };
      const expectedWines = mockWines.filter(wine => wine.quantity <= 5);
      const mockQuery = mockSupabase.from().select();
      mockQuery.range.mockResolvedValue(mockSuccessfulResponse(expectedWines, 2));

      // When
      const result = await wineService.getAllWines(filter);

      // Then
      expect(mockQuery.lte).toHaveBeenCalledWith('quantity', 5);
      expect(result.wines).toEqual(expectedWines);
    });

    it('데이터베이스 오류 시 예외를 발생시켜야 한다', async () => {
      // Given
      const mockQuery = mockSupabase.from().select();
      mockQuery.range.mockResolvedValue(mockErrorResponse('데이터베이스 연결 실패'));

      // When & Then
      await expect(wineService.getAllWines()).rejects.toThrow('데이터베이스 조회 실패: 데이터베이스 연결 실패');
    });
  });

  describe('getWineById', () => {
    it('유효한 ID로 와인을 조회해야 한다', async () => {
      // Given
      const wineId = '1';
      const expectedWine = mockWines[0];
      const mockQuery = mockSupabase.from().select();
      mockQuery.single.mockResolvedValue(mockSuccessfulResponse(expectedWine));

      // When
      const result = await wineService.getWineById(wineId);

      // Then
      expect(mockSupabase.from).toHaveBeenCalledWith('wines');
      expect(mockQuery.eq).toHaveBeenCalledWith('id', wineId);
      expect(mockQuery.single).toHaveBeenCalled();
      expect(result).toEqual(expectedWine);
    });

    it('존재하지 않는 ID로 조회 시 예외를 발생시켜야 한다', async () => {
      // Given
      const wineId = 'nonexistent';
      const mockQuery = mockSupabase.from().select();
      mockQuery.single.mockResolvedValue(mockErrorResponse('Row not found', 'PGRST116'));

      // When & Then
      await expect(wineService.getWineById(wineId)).rejects.toThrow('와인을 찾을 수 없습니다.');
    });

    it('데이터베이스 오류 시 예외를 발생시켜야 한다', async () => {
      // Given
      const wineId = '1';
      const mockQuery = mockSupabase.from().select();
      mockQuery.single.mockResolvedValue(mockErrorResponse('데이터베이스 오류'));

      // When & Then
      await expect(wineService.getWineById(wineId)).rejects.toThrow('데이터베이스 조회 실패: 데이터베이스 오류');
    });
  });

  describe('createWine', () => {
    it('새 와인을 생성해야 한다', async () => {
      // Given
      const wineData = {
        name: 'Test Wine',
        country_code: 'FR',
        vintage: 2020,
        price: 100000,
        quantity: 10
      };
      const expectedWine = createMockWine(wineData);
      const mockQuery = mockSupabase.from().insert();
      mockQuery.single.mockResolvedValue(mockSuccessfulResponse(expectedWine));

      // When
      const result = await wineService.createWine(wineData);

      // Then
      expect(mockSupabase.from).toHaveBeenCalledWith('wines');
      expect(mockQuery.insert).toHaveBeenCalledWith([wineData]);
      expect(mockQuery.select).toHaveBeenCalled();
      expect(mockQuery.single).toHaveBeenCalled();
      expect(result).toEqual(expectedWine);
    });

    it('데이터베이스 오류 시 예외를 발생시켜야 한다', async () => {
      // Given
      const wineData = {
        name: 'Test Wine',
        country_code: 'FR',
        vintage: 2020,
        price: 100000,
        quantity: 10
      };
      const mockQuery = mockSupabase.from().insert();
      mockQuery.single.mockResolvedValue(mockErrorResponse('중복된 데이터'));

      // When & Then
      await expect(wineService.createWine(wineData)).rejects.toThrow('와인 생성 실패: 중복된 데이터');
    });
  });

  describe('updateWine', () => {
    it('와인 정보를 업데이트해야 한다', async () => {
      // Given
      const wineId = '1';
      const updateData = {
        name: 'Updated Wine',
        price: 200000
      };
      const expectedWine = createMockWine({ id: wineId, ...updateData });
      const mockQuery = mockSupabase.from().update();
      mockQuery.single.mockResolvedValue(mockSuccessfulResponse(expectedWine));

      // When
      const result = await wineService.updateWine(wineId, updateData);

      // Then
      expect(mockSupabase.from).toHaveBeenCalledWith('wines');
      expect(mockQuery.update).toHaveBeenCalledWith({
        ...updateData,
        updated_at: expect.any(String)
      });
      expect(mockQuery.eq).toHaveBeenCalledWith('id', wineId);
      expect(mockQuery.select).toHaveBeenCalled();
      expect(mockQuery.single).toHaveBeenCalled();
      expect(result).toEqual(expectedWine);
    });

    it('존재하지 않는 와인 업데이트 시 예외를 발생시켜야 한다', async () => {
      // Given
      const wineId = 'nonexistent';
      const updateData = { name: 'Updated Wine' };
      const mockQuery = mockSupabase.from().update();
      mockQuery.single.mockResolvedValue(mockErrorResponse('Row not found', 'PGRST116'));

      // When & Then
      await expect(wineService.updateWine(wineId, updateData)).rejects.toThrow('와인을 찾을 수 없습니다.');
    });

    it('데이터베이스 오류 시 예외를 발생시켜야 한다', async () => {
      // Given
      const wineId = '1';
      const updateData = { name: 'Updated Wine' };
      const mockQuery = mockSupabase.from().update();
      mockQuery.single.mockResolvedValue(mockErrorResponse('데이터베이스 오류'));

      // When & Then
      await expect(wineService.updateWine(wineId, updateData)).rejects.toThrow('와인 업데이트 실패: 데이터베이스 오류');
    });
  });

  describe('deleteWine', () => {
    it('와인을 삭제해야 한다', async () => {
      // Given
      const wineId = '1';
      const mockQuery = mockSupabase.from().delete();
      mockQuery.mockResolvedValue(mockSuccessfulResponse(null));

      // When
      const result = await wineService.deleteWine(wineId);

      // Then
      expect(mockSupabase.from).toHaveBeenCalledWith('wines');
      expect(mockQuery.delete).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith('id', wineId);
      expect(result).toBe(true);
    });

    it('데이터베이스 오류 시 예외를 발생시켜야 한다', async () => {
      // Given
      const wineId = '1';
      const mockQuery = mockSupabase.from().delete();
      mockQuery.mockResolvedValue(mockErrorResponse('삭제 권한 없음'));

      // When & Then
      await expect(wineService.deleteWine(wineId)).rejects.toThrow('와인 삭제 실패: 삭제 권한 없음');
    });
  });

  describe('getLowStockWines', () => {
    it('기본 임계값으로 저재고 와인을 조회해야 한다', async () => {
      // Given
      const expectedWines = mockWines.filter(wine => wine.quantity <= 5);
      const mockQuery = mockSupabase.from().select();
      mockQuery.order.mockResolvedValue(mockSuccessfulResponse(expectedWines));

      // When
      const result = await wineService.getLowStockWines();

      // Then
      expect(mockSupabase.from).toHaveBeenCalledWith('wines');
      expect(mockQuery.lte).toHaveBeenCalledWith('quantity', 5);
      expect(mockQuery.order).toHaveBeenCalledWith('quantity', { ascending: true });
      expect(result).toEqual(expectedWines);
    });

    it('사용자 정의 임계값으로 저재고 와인을 조회해야 한다', async () => {
      // Given
      const threshold = 3;
      const expectedWines = mockWines.filter(wine => wine.quantity <= threshold);
      const mockQuery = mockSupabase.from().select();
      mockQuery.order.mockResolvedValue(mockSuccessfulResponse(expectedWines));

      // When
      const result = await wineService.getLowStockWines(threshold);

      // Then
      expect(mockQuery.lte).toHaveBeenCalledWith('quantity', threshold);
      expect(result).toEqual(expectedWines);
    });

    it('데이터베이스 오류 시 예외를 발생시켜야 한다', async () => {
      // Given
      const mockQuery = mockSupabase.from().select();
      mockQuery.order.mockResolvedValue(mockErrorResponse('데이터베이스 오류'));

      // When & Then
      await expect(wineService.getLowStockWines()).rejects.toThrow('저재고 와인 조회 실패: 데이터베이스 오류');
    });
  });
});
