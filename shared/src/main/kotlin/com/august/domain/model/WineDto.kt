package com.august.domain.model

import kotlinx.serialization.Serializable

/**
 * 와인 생성 요청 DTO (Data Transfer Object)
 * 
 * 클라이언트에서 새로운 와인을 등록할 때 사용하는 데이터 구조입니다.
 * ID는 서버에서 자동 생성되므로 포함하지 않습니다.
 * 
 * @property name 와인 이름
 * @property countryCode 생산 국가 코드
 * @property vintage 빈티지 연도
 * @property price 가격
 * @property quantity 재고 수량
 */
@Serializable
data class CreateWineRequest(
    val name: String,
    val countryCode: String,
    val vintage: Int,
    val price: Double,
    val quantity: Int
)

/**
 * 와인 수량 업데이트 요청 DTO
 * 
 * 와인의 재고 수량을 변경할 때 사용합니다.
 * 
 * @property quantity 추가할 수량 (양수: 입고, 음수: 출고)
 */
@Serializable
data class UpdateWineQuantityRequest(
    val quantity: Int
)

/**
 * 와인 정보 업데이트 요청 DTO
 * 
 * 와인의 정보를 수정할 때 사용합니다.
 * 모든 필드가 선택적(nullable)이며, 제공된 필드만 업데이트됩니다.
 * 
 * @property name 와인 이름 (선택적)
 * @property countryCode 생산 국가 코드 (선택적)
 * @property vintage 빈티지 연도 (선택적)
 * @property price 가격 (선택적)
 * @property quantity 재고 수량 (선택적)
 */
@Serializable
data class UpdateWineRequest(
    val name: String? = null,
    val countryCode: String? = null,
    val vintage: Int? = null,
    val price: Double? = null,
    val quantity: Int? = null
)

/**
 * API 에러 응답 DTO
 * 
 * API 요청 처리 중 에러가 발생했을 때 반환되는 데이터 구조입니다.
 * 
 * @property message 에러 메시지
 * @property code 에러 코드 (선택적)
 */
@Serializable
data class ErrorResponse(
    val message: String,
    val code: String? = null
)

/**
 * 성공 응답 DTO
 * 
 * 단순 성공/실패를 나타내는 응답입니다.
 * 
 * @property success 성공 여부
 * @property message 응답 메시지 (선택적)
 */
@Serializable
data class SuccessResponse(
    val success: Boolean,
    val message: String? = null
)

