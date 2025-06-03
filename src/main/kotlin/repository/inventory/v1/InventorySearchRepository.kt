package com.august.repository.inventory.v1

import com.august.domain.model.v1.Wine

interface InventorySearchRepository {
    //검색
    fun findWineByFilter(wines: List<Wine>, vararg filterTypes: InventoryFilterType): List<Wine>
}