package com.august.service.inventory

import com.august.domain.model.Wine
import com.august.service.inventory.InventoryFilterType.*

class InventorySearchRepositoryImpl : InventorySearchRepository {
    override fun findWineByFilter(
        wines: List<Wine>,
        vararg filterTypes: InventoryFilterType,
    ): List<Wine> {
        return filterTypes.map { getFiltered(wines, it) }
            .reduce {acc, filtered -> acc.intersect(filtered.toSet()).toList() }
            .toList()
    }

    private fun getFiltered(
        wines: List<Wine>,
        filterType: InventoryFilterType,
    ): List<Wine> {
        return when (filterType) {
            is WineryName -> {
                wines.filter { it.wineryName == filterType.name }
            }

            is CountryCode -> {
                wines.filter { it.countryCode == filterType.code }
            }

            is Vintage -> {
                filterType.rangeFilter.applyFilters(
                    exact = { filter -> wines.filter { it.vintage == filter.value } },
                    minMax = { filter -> wines.filter { it.vintage >= filter.min && it.vintage <= filter.max } }
                )
            }

            is Price -> {
                filterType.rangeFilter.applyFilters(
                    exact = { filter -> wines.filter { it.price == filter.value } },
                    minMax = { filter -> wines.filter { it.price >= filter.min && it.price <= filter.max } }
                )
            }

            is Quantity -> {
                filterType.rangeFilter.applyFilters(
                    exact = { filter -> wines.filter { it.quantity == filter.value } },
                    minMax = { filter -> wines.filter { it.quantity >= filter.min && it.quantity <= filter.max } }
                )
            }
        }
    }

    private fun RangeFilter.applyFilters(
        exact: (RangeFilter.Exact) -> List<Wine>,
        minMax: (RangeFilter.MinMax) -> List<Wine>,
    ): List<Wine> {
        return when (this) {
            is RangeFilter.Exact -> {
                exact(this)
            }

            is RangeFilter.MinMax -> {
                minMax(this)
            }
        }
    }
}