package com.august.domain.model

import kotlinx.serialization.Serializable

/**
 * 와인 생성 요청 데이터 클래스
 * 
 * Backend API에 와인을 생성하기 위한 요청 데이터를 담는 클래스입니다.
 * CLI에서 와인 등록 시 사용됩니다.
 */
@Serializable
data class CreateWineRequest(
    val name: String,
    val country_code: String,
    val vintage: Int,
    val price: Double,
    val quantity: Int
)
