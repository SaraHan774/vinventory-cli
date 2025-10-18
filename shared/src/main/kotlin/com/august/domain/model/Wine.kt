package com.august.domain.model

import kotlinx.serialization.Serializable

/**
 * 와인 도메인 모델
 * 
 * 백엔드와 프론트엔드에서 공통으로 사용하는 와인 데이터 구조입니다.
 * 
 * @property id 와인 고유 식별자 (UUID)
 * @property name 와인 이름
 * @property countryCode 생산 국가 코드 (예: KR, FR, IT)
 * @property vintage 빈티지 연도
 * @property price 가격 (달러)
 * @property quantity 재고 수량
 */
@Serializable
data class Wine(
    val id: String,
    val name: String,
    val countryCode: String,
    val vintage: Int,
    val price: Double,
    val quantity: Int
)

