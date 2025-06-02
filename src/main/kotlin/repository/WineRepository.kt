package com.august.repository

import com.august.domain.Wine

class WineRepository : IWineRepository {
    private val wines = mutableMapOf<String, Wine>()

    override fun save(wine: Wine): Wine {
        wines[wine.id] = wine
        return wine
    }

    override fun findById(id: String): Wine? {
        return wines[id]
    }

    override fun delete(id: String) {
        wines.remove(id)
    }

    override fun update(wine: Wine): Wine {
        wines[wine.id] = wine
        return wine
    }

    override fun findAll(): List<Wine> {
        return wines.values.toList()
    }
} 