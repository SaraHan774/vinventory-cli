package com.august.backend.repository

import com.august.domain.model.Wine

/**
 * 와인 레포지토리 인터페이스
 * 
 * 와인 데이터의 영속성을 담당하는 레포지토리 인터페이스입니다.
 */
interface IWineRepository {
    /**
     * 와인 저장
     * 
     * @param wine 저장할 와인 객체
     * @return 저장된 와인 객체
     */
    fun save(wine: Wine): Wine
    
    /**
     * ID로 와인 조회
     * 
     * @param id 와인 ID
     * @return 조회된 와인 객체 (없으면 null)
     */
    fun findById(id: String): Wine?
    
    /**
     * 와인 삭제
     * 
     * @param id 삭제할 와인 ID
     */
    fun delete(id: String)
    
    /**
     * 와인 정보 업데이트
     * 
     * @param wine 업데이트할 와인 객체
     * @return 업데이트된 와인 객체
     */
    fun update(wine: Wine): Wine
    
    /**
     * 모든 와인 조회
     * 
     * @return 모든 와인 목록
     */
    fun findAll(): List<Wine>
    
    /**
     * 이름으로 와인 검색
     * 
     * @param query 검색 쿼리 (부분 매칭)
     * @return 검색된 와인 목록
     */
    fun searchByName(query: String): List<Wine>
    
    /**
     * 빈티지 범위로 와인 필터링
     * 
     * @param startYear 시작 연도
     * @param endYear 종료 연도
     * @return 필터링된 와인 목록
     */
    fun filterByVintageRange(startYear: Int, endYear: Int): List<Wine>
    
    /**
     * 가격 범위로 와인 필터링
     * 
     * @param minPrice 최소 가격
     * @param maxPrice 최대 가격
     * @return 필터링된 와인 목록
     */
    fun filterByPriceRange(minPrice: Double, maxPrice: Double): List<Wine>
    
    /**
     * 국가 코드로 와인 필터링
     * 
     * @param countryCode 국가 코드
     * @return 필터링된 와인 목록
     */
    fun filterByCountry(countryCode: String): List<Wine>
    
    /**
     * 재고 부족 와인 조회
     * 
     * @param threshold 재고 부족 기준 (기본값: 5)
     * @return 재고 부족 와인 목록
     */
    fun findLowStock(threshold: Int = 5): List<Wine>
}

