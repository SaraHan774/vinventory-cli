package com.august.domain.v2

import kotlinx.serialization.Serializable

@Serializable
data class Wine(
    val id: String,
    val name: String,
    val country_code: String,
    val vintage: Int,
    val price: Double,
    val quantity: Int
) 