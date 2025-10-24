package com.august.domain.model

import kotlinx.serialization.Serializable

/**
 * 와인 업데이트 요청 데이터 클래스
 * 
 * Backend API에 와인 정보를 업데이트하기 위한 요청 데이터를 담는 클래스입니다.
 * CLI에서 와인 정보 수정 시 사용됩니다.
 */
@Serializable
data class UpdateWineRequest(
    val name: String? = null,
    val country_code: String? = null,
    val vintage: Int? = null,
    val price: Double? = null,
    val quantity: Int? = null
)
