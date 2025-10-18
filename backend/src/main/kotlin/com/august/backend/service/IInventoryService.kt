package com.august.backend.service

import com.august.domain.model.Wine

/**
 * 재고 관리 서비스 인터페이스
 * 
 * 와인 재고 관리를 위한 비즈니스 로직을 정의합니다.
 */
interface IInventoryService {
    /**
     * 와인 등록
     * 
     * @param name 와인 이름
     * @param countryCode 생산 국가 코드
     * @param vintage 빈티지 연도
     * @param price 가격
     * @param quantity 초기 재고 수량
     * @return 등록된 와인 객체
     */
    fun registerWine(name: String, countryCode: String, vintage: Int, price: Double, quantity: Int): Wine
    
    /**
     * 와인 삭제
     * 
     * @param id 삭제할 와인 ID
     */
    fun deleteWine(id: String)
    
    /**
     * 와인 수량 추가
     * 
     * @param id 와인 ID
     * @param quantity 추가할 수량 (음수면 차감)
     */
    fun addWine(id: String, quantity: Int)
    
    /**
     * 와인 조회
     * 
     * @param id 와인 ID
     * @return 조회된 와인 객체
     * @throws IllegalArgumentException 와인을 찾을 수 없는 경우
     */
    fun retrieveWine(id: String): Wine
    
    /**
     * 모든 와인 조회
     * 
     * @return 모든 와인 목록
     */
    fun getAllWines(): List<Wine>
    
    /**
     * 이름으로 와인 검색
     * 
     * @param query 검색 쿼리
     * @return 검색된 와인 목록
     */
    fun searchWinesByName(query: String): List<Wine>
    
    /**
     * 빈티지 범위로 와인 필터링
     * 
     * @param startYear 시작 연도
     * @param endYear 종료 연도
     * @return 필터링된 와인 목록
     * @throws IllegalArgumentException 시작 연도가 종료 연도보다 큰 경우
     */
    fun findWinesByVintageRange(startYear: Int, endYear: Int): List<Wine>
    
    /**
     * 가격 범위로 와인 필터링
     * 
     * @param minPrice 최소 가격
     * @param maxPrice 최대 가격
     * @return 필터링된 와인 목록
     * @throws IllegalArgumentException 가격 범위가 유효하지 않은 경우
     */
    fun findWinesByPriceRange(minPrice: Double, maxPrice: Double): List<Wine>
    
    /**
     * 국가 코드로 와인 필터링
     * 
     * @param countryCode 국가 코드
     * @return 필터링된 와인 목록
     */
    fun findWinesByCountry(countryCode: String): List<Wine>
    
    /**
     * 재고 부족 와인 조회
     * 
     * @param threshold 재고 부족 기준 (기본값: 5)
     * @return 재고 부족 와인 목록
     * @throws IllegalArgumentException threshold가 음수인 경우
     */
    fun findLowStockWines(threshold: Int = 5): List<Wine>
}

