package com.august.repository.db

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime
import org.slf4j.LoggerFactory

class MigrationManager {
    private val logger = LoggerFactory.getLogger(MigrationManager::class.java)
    private val migrations = mutableListOf<Migration>()

    fun register(migration: Migration) {
        migrations.add(migration)
    }

    fun migrate() {
        transaction {
            // Create migrations table if it doesn't exist
            SchemaUtils.create(MigrationTable)

            // Sort migrations by version
            val pendingMigrations = migrations
                .sortedBy { it.version }
                .filter { migration ->
                    MigrationTable.select { MigrationTable.version eq migration.version }
                        .empty()
                }

            if (pendingMigrations.isEmpty()) {
                logger.info("No pending migrations found")
                return@transaction
            }

            // Apply pending migrations
            pendingMigrations.forEach { migration ->
                try {
                    logger.info("Applying migration ${migration.version}: ${migration.description}")
                    
                    migration.up(this)
                    
                    // Record the migration
                    MigrationTable.insert {
                        it[version] = migration.version
                        it[description] = migration.description
                        it[appliedAt] = LocalDateTime.now()
                    }
                    
                    logger.info("Successfully applied migration ${migration.version}")
                } catch (e: Exception) {
                    logger.error("Failed to apply migration ${migration.version}", e)
                    throw e
                }
            }
        }
    }

    fun rollback(targetVersion: String? = null) {
        transaction {
            // Get all applied migrations
            val appliedMigrations = MigrationTable
                .selectAll()
                .map { it[MigrationTable.version] }
                .toSet()

            // Filter and sort migrations to rollback
            val migrationsToRollback = migrations
                .filter { it.version in appliedMigrations }
                .sortedByDescending { it.version }
                .takeWhile { targetVersion == null || it.version > targetVersion }

            if (migrationsToRollback.isEmpty()) {
                logger.info("No migrations to rollback")
                return@transaction
            }

            // Rollback migrations
            migrationsToRollback.forEach { migration ->
                try {
                    logger.info("Rolling back migration ${migration.version}: ${migration.description}")
                    
                    migration.down(this)
                    
                    // Remove migration record
                    MigrationTable.deleteWhere { MigrationTable.version eq migration.version }
                    
                    logger.info("Successfully rolled back migration ${migration.version}")
                } catch (e: Exception) {
                    logger.error("Failed to rollback migration ${migration.version}", e)
                    throw e
                }
            }
        }
    }

    fun status(): List<MigrationStatus> {
        return transaction {
            val appliedMigrations = MigrationTable
                .selectAll()
                .map { row ->
                    row[MigrationTable.version] to row[MigrationTable.appliedAt]
                }
                .toMap()

            migrations
                .sortedBy { it.version }
                .map { migration ->
                    MigrationStatus(
                        version = migration.version,
                        description = migration.description,
                        appliedAt = appliedMigrations[migration.version],
                        status = if (migration.version in appliedMigrations) "APPLIED" else "PENDING"
                    )
                }
        }
    }
}

data class MigrationStatus(
    val version: String,
    val description: String,
    val appliedAt: LocalDateTime?,
    val status: String
) 