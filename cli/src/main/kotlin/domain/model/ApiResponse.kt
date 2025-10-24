package com.august.domain.model

import kotlinx.serialization.Serializable

/**
 * Backend API 응답 형식
 * 
 * Backend API에서 반환하는 표준 응답 형식입니다.
 * 모든 API 응답은 이 형식을 따릅니다.
 */
@Serializable
data class ApiResponse<T>(
    val success: Boolean,
    val data: T? = null,
    val message: String? = null,
    val error: String? = null
)
