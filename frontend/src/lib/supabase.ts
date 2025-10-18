/**
 * Supabase 클라이언트 설정
 * 
 * Supabase를 사용한 데이터베이스 연결 및 인증을 관리합니다.
 */

import { createClient } from '@supabase/supabase-js'
import type { Wine } from '../types/wine'

// Supabase 설정
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// 디버깅 정보 출력
console.log('🔍 환경 변수 디버깅:')
console.log('VITE_SUPABASE_URL:', supabaseUrl)
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '설정됨' : '설정되지 않음')
console.log('전체 import.meta.env:', import.meta.env)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase 환경 변수 오류:')
  console.error('URL:', supabaseUrl)
  console.error('Key:', supabaseAnonKey ? '설정됨' : '설정되지 않음')
  throw new Error('Supabase 환경 변수가 설정되지 않았습니다.')
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * 와인 관련 데이터베이스 작업
 */
export class WineService {
  /**
   * 모든 와인 조회
   */
  static async getAllWines(): Promise<Wine[]> {
    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  /**
   * 특정 와인 조회
   */
  static async getWineById(id: string): Promise<Wine> {
    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  /**
   * 와인 생성
   */
  static async createWine(wineData: Omit<Wine, 'id'>): Promise<Wine> {
    const { data, error } = await supabase
      .from('wines')
      .insert([wineData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * 와인 업데이트
   */
  static async updateWine(id: string, wineData: Partial<Wine>): Promise<Wine> {
    const { data, error } = await supabase
      .from('wines')
      .update(wineData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * 와인 삭제
   */
  static async deleteWine(id: string): Promise<void> {
    const { error } = await supabase
      .from('wines')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  /**
   * 이름으로 와인 검색
   */
  static async searchWines(query: string): Promise<Wine[]> {
    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  /**
   * 재고 부족 와인 조회
   */
  static async getLowStockWines(threshold: number = 5): Promise<Wine[]> {
    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .lte('quantity', threshold)
      .order('quantity', { ascending: true })

    if (error) throw error
    return data || []
  }

  /**
   * 빈티지 범위로 와인 필터링
   */
  static async filterByVintageRange(startYear: number, endYear: number): Promise<Wine[]> {
    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .gte('vintage', startYear)
      .lte('vintage', endYear)
      .order('vintage', { ascending: false })

    if (error) throw error
    return data || []
  }

  /**
   * 가격 범위로 와인 필터링
   */
  static async filterByPriceRange(minPrice: number, maxPrice: number): Promise<Wine[]> {
    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .gte('price', minPrice)
      .lte('price', maxPrice)
      .order('price', { ascending: true })

    if (error) throw error
    return data || []
  }

  /**
   * 국가 코드로 와인 필터링
   */
  static async filterByCountry(countryCode: string): Promise<Wine[]> {
    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .eq('country_code', countryCode.toUpperCase())
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}
