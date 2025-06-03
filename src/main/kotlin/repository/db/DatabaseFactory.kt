package com.august.repository.db

import org.jetbrains.exposed.sql.Database
import com.august.repository.db.migrations.V0001Migration
import java.io.File
import org.slf4j.LoggerFactory

object DatabaseFactory {
    private val logger = LoggerFactory.getLogger(DatabaseFactory::class.java)
    private val migrationManager = MigrationManager()

    fun init(dbPath: String = "vinventory.db") {
        val dbFile = File(dbPath)
        val url = "jdbc:sqlite:${dbFile.absolutePath}"
        
        // Connect to database
        Database.connect(url, "org.sqlite.JDBC")
        
        // Register migrations
        registerMigrations()
        
        // Run migrations
        try {
            migrationManager.migrate()
        } catch (e: Exception) {
            logger.error("Failed to apply migrations", e)
            throw e
        }
    }
    
    private fun registerMigrations() {
        // Register all migrations here
        migrationManager.register(V0001Migration())
    }
    
    fun getMigrationStatus(): List<MigrationStatus> {
        return migrationManager.status()
    }
    
    fun rollback(targetVersion: String? = null) {
        migrationManager.rollback(targetVersion)
    }
} 