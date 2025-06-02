package com.august.repository

import com.august.domain.Wine

interface IWineRepository {
    fun save(wine: Wine): Wine
    fun findById(id: String): Wine?
    fun delete(id: String)
    fun update(wine: Wine): Wine
    fun findAll(): List<Wine>
} 