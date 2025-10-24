import { supabase } from '../config/supabase';
import {
  Wine,
  CreateWineRequest,
  UpdateWineRequest,
  WineSearchFilter,
  WineSortOptions,
  WineListResponse
} from '../types/wine';
import { NotFoundError, InternalServerError } from '../errors/HttpErrors';
import { generateExternalLinks, normalizeUrl } from '../utils/externalLinksUtils';

/**
 * 와인 서비스 클래스
 * 
 * Supabase를 사용한 와인 데이터 CRUD 작업을 담당합니다.
 * 기존 Kotlin 서비스와 동일한 기능을 제공합니다.
 */
export class WineService {
  
  /**
   * 모든 와인 목록 조회
   * 
   * @param filter 검색 필터
   * @param sort 정렬 옵션
   * @param page 페이지 번호 (1부터 시작)
   * @param limit 페이지당 항목 수
   * @returns 와인 목록과 페이지네이션 정보
   */
  async getAllWines(
    filter: WineSearchFilter = {},
    sort: WineSortOptions = { field: 'created_at', order: 'desc' },
    page: number = 1,
    limit: number = 20
  ): Promise<WineListResponse> {
    try {
      let query = supabase
        .from('wines')
        .select('*', { count: 'exact' });

      // 필터 적용
      if (filter.name) {
        query = query.ilike('name', `%${filter.name}%`);
      }
      if (filter.country_code) {
        query = query.eq('country_code', filter.country_code);
      }
      if (filter.vintage_min !== undefined) {
        query = query.gte('vintage', filter.vintage_min);
      }
      if (filter.vintage_max !== undefined) {
        query = query.lte('vintage', filter.vintage_max);
      }
      if (filter.price_min !== undefined) {
        query = query.gte('price', filter.price_min);
      }
      if (filter.price_max !== undefined) {
        query = query.lte('price', filter.price_max);
      }
      if (filter.low_stock) {
        query = query.lte('quantity', 5); // 5개 이하를 저재고로 간주
      }

      // 정렬 적용
      query = query.order(sort.field, { ascending: sort.order === 'asc' });

      // 페이지네이션 적용
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw new InternalServerError(`데이터베이스 조회 실패: ${error.message}`);
      }

      const total = count || 0;
      const total_pages = Math.ceil(total / limit);

      return {
        wines: data || [],
        pagination: {
          page,
          limit,
          total,
          total_pages
        }
      };
    } catch (error) {
      console.error('와인 목록 조회 오류:', error);
      throw error;
    }
  }

  /**
   * ID로 와인 조회
   * 
   * @param id 와인 ID
   * @returns 와인 정보
   */
  async getWineById(id: string): Promise<Wine> {
    try {
      const { data, error } = await supabase
        .from('wines')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('와인을 찾을 수 없습니다.');
        }
        throw new InternalServerError(`데이터베이스 조회 실패: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('와인 조회 오류:', error);
      throw error;
    }
  }

  /**
   * 새 와인 생성
   * 
   * @param wineData 와인 생성 데이터
   * @returns 생성된 와인 정보
   */
  async createWine(wineData: CreateWineRequest): Promise<Wine> {
    try {
      // 외부 링크 자동 생성
      const externalLinks = generateExternalLinks(
        wineData.name,
        wineData.vintage,
        wineData.vivino_url,
        wineData.wine_searcher_url
      );

      // 데이터 정규화
      const wineDataWithLinks = {
        ...wineData,
        vivino_url: normalizeUrl(externalLinks.vivino_url),
        wine_searcher_url: normalizeUrl(externalLinks.wine_searcher_url)
      };

      const { data, error } = await supabase
        .from('wines')
        .insert([wineDataWithLinks])
        .select()
        .single();

      if (error) {
        throw new InternalServerError(`와인 생성 실패: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('와인 생성 오류:', error);
      throw error;
    }
  }

  /**
   * 와인 정보 업데이트
   * 
   * @param id 와인 ID
   * @param wineData 업데이트할 와인 데이터
   * @returns 업데이트된 와인 정보
   */
  async updateWine(id: string, wineData: UpdateWineRequest): Promise<Wine> {
    try {
      // 기존 와인 정보 조회 (외부 링크 생성에 필요)
      const existingWine = await this.getWineById(id);
      
      // 외부 링크 자동 생성 (이름이나 빈티지가 변경된 경우)
      const shouldRegenerateLinks = wineData.name || wineData.vintage;
      let externalLinks = {};
      
      if (shouldRegenerateLinks) {
        const wineName = wineData.name || existingWine.name;
        const vintage = wineData.vintage || existingWine.vintage;
        
        externalLinks = generateExternalLinks(
          wineName,
          vintage,
          wineData.vivino_url,
          wineData.wine_searcher_url
        );
      }

      // 데이터 정규화
      const updateData = {
        ...wineData,
        ...(shouldRegenerateLinks && externalLinks),
        vivino_url: normalizeUrl(wineData.vivino_url || (externalLinks as any).vivino_url),
        wine_searcher_url: normalizeUrl(wineData.wine_searcher_url || (externalLinks as any).wine_searcher_url),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('wines')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError('와인을 찾을 수 없습니다.');
        }
        throw new InternalServerError(`와인 업데이트 실패: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('와인 업데이트 오류:', error);
      throw error;
    }
  }

  /**
   * 와인 삭제
   * 
   * @param id 와인 ID
   * @returns 삭제 성공 여부
   */
  async deleteWine(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('wines')
        .delete()
        .eq('id', id);

      if (error) {
        throw new InternalServerError(`와인 삭제 실패: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('와인 삭제 오류:', error);
      throw error;
    }
  }

  /**
   * 저재고 와인 목록 조회
   * 
   * @param threshold 재고 임계값 (기본값: 5)
   * @returns 저재고 와인 목록
   */
  async getLowStockWines(threshold: number = 5): Promise<Wine[]> {
    try {
      const { data, error } = await supabase
        .from('wines')
        .select('*')
        .lte('quantity', threshold)
        .order('quantity', { ascending: true });

      if (error) {
        throw new InternalServerError(`저재고 와인 조회 실패: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('저재고 와인 조회 오류:', error);
      throw error;
    }
  }
}
