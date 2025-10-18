package com.august.repository.db

import org.jetbrains.exposed.sql.Transaction

interface Migration {
    val version: String
    val description: String
    
    fun up(transaction: Transaction)
    fun down(transaction: Transaction)
}

abstract class BaseMigration : Migration {
    override val version: String
        get() = this::class.simpleName?.replace("Migration", "") 
            ?: throw IllegalStateException("Migration class name must end with 'Migration'")
            
    protected fun requireVersion(version: String) {
        if (!version.matches(Regex("V\\d{4}"))) {
            throw IllegalStateException("Migration version must be in format 'V' followed by 4 digits, e.g. V0001")
        }
    }
} 