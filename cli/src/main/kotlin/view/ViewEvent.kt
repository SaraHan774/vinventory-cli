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
    
    // Search and filter events
    data class SearchWinesByName(val query: String) : ViewEvent()
    data class FilterByVintage(val startYear: Int, val endYear: Int) : ViewEvent()
    data class FilterByPrice(val minPrice: Double, val maxPrice: Double) : ViewEvent()
    data class FilterByCountry(val countryCode: String) : ViewEvent()
    data object ShowLowStockWines : ViewEvent()
    data object ListAllWines : ViewEvent()
} 