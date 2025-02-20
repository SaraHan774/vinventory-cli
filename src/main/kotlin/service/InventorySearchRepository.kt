package com.august.service

import com.august.domain.model.Wine

interface InventorySearchRepository {
    //검색
    fun findWineByFilter(wines: List<Wine>, vararg filterTypes: InventoryFilterType): List<Wine>
}