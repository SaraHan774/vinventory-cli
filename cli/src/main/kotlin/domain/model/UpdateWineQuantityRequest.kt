package com.august.domain.model

import kotlinx.serialization.Serializable

/**
 * 와인 수량 업데이트 요청 데이터 클래스
 * 
 * Backend API에 와인 수량을 업데이트하기 위한 요청 데이터를 담는 클래스입니다.
 * CLI에서 와인 수량 추가/차감 시 사용됩니다.
 */
@Serializable
data class UpdateWineQuantityRequest(
    val quantity: Int
)
