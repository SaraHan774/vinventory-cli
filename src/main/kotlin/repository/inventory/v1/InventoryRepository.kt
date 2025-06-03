package com.august.repository.inventory.v1

import com.august.domain.model.v1.Wine

interface InventoryRepository {
    // 재고 등록
    fun register(wine: Wine, modifiedBy: String = ""): Boolean

    // 재고 삭제
    fun delete(id: String, modifiedBy: String = ""): Boolean

    // 입고
    fun store(id: String, quantity: Int, modifiedBy: String = ""): Boolean

    // 출고
    fun retrieve(id: String, quantity: Int, modifiedBy: String = ""): Boolean

    // 전체 조회
    fun getAll(): List<Wine>

    // 아이디로 조회
    fun getById(id: String): Wine?
}

sealed class InventoryFilterType {
    data class WineryName(val name: String) : InventoryFilterType()
    data class CountryCode(val code: String) : InventoryFilterType()
    data class Vintage(val rangeFilter: RangeFilter) : InventoryFilterType()
    data class Price(val rangeFilter: RangeFilter) : InventoryFilterType()
    data class Quantity(val rangeFilter: RangeFilter) : InventoryFilterType()
}

sealed class RangeFilter {
    data class Exact(val value: Int): RangeFilter()
    data class MinMax(val min: Int, val max: Int): RangeFilter()
}
