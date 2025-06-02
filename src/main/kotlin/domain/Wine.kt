package com.august.domain

data class Wine(
    val id: String,
    val name: String,
    val countryCode: String,
    val vintage: Int,
    val price: Double,
    val quantity: Int
) 