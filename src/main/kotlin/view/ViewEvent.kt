package com.august.view

sealed class ViewEvent {
    data class RegisterWine(
        val name: String,
        val countryCode: String,
        val vintage: Int,
        val price: Double,
        val quantity: Int
    ) : ViewEvent()

    data class DeleteWine(val id: String) : ViewEvent()
    data class AddWine(val id: String, val quantity: Int) : ViewEvent()
    data class RetrieveWine(val id: String) : ViewEvent()
} 