package com.august.backend.repository.db

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import java.time.LocalDateTime
import org.slf4j.LoggerFactory

/**
 * 마이그레이션 관리자
 * 
 * 데이터베이스 마이그레이션의 등록, 적용, 롤백, 상태 조회를 담당합니다.
 */
class MigrationManager {
    private val logger = LoggerFactory.getLogger(MigrationManager::class.java)
    private val migrations = mutableListOf<Migration>()

    /**
     * 마이그레이션 등록
     * 
     * @param migration 등록할 마이그레이션
     */
    fun register(migration: Migration) {
        migrations.add(migration)
    }

    /**
     * 대기 중인 마이그레이션 적용
     * 
     * 아직 적용되지 않은 모든 마이그레이션을 버전 순서대로 적용합니다.
     */
    fun migrate() {
        transaction {
            // 마이그레이션 테이블이 없으면 생성
            SchemaUtils.create(MigrationTable)

            // 버전 순으로 정렬하고 미적용 마이그레이션 필터링
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

            // 대기 중인 마이그레이션 적용
            pendingMigrations.forEach { migration ->
                try {
                    logger.info("Applying migration ${migration.version}: ${migration.description}")
                    
                    migration.up(this)
                    
                    // 마이그레이션 기록
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

    /**
     * 마이그레이션 롤백
     * 
     * @param targetVersion 롤백할 대상 버전 (null이면 모든 마이그레이션 롤백)
     */
    fun rollback(targetVersion: String? = null) {
        transaction {
            // 적용된 모든 마이그레이션 조회
            val appliedMigrations = MigrationTable
                .selectAll()
                .map { it[MigrationTable.version] }
                .toSet()

            // 롤백할 마이그레이션 필터링 및 정렬
            val migrationsToRollback = migrations
                .filter { it.version in appliedMigrations }
                .sortedByDescending { it.version }
                .takeWhile { targetVersion == null || it.version > targetVersion }

            if (migrationsToRollback.isEmpty()) {
                logger.info("No migrations to rollback")
                return@transaction
            }

            // 마이그레이션 롤백 실행
            migrationsToRollback.forEach { migration ->
                try {
                    logger.info("Rolling back migration ${migration.version}: ${migration.description}")
                    
                    migration.down(this)
                    
                    // 마이그레이션 기록 삭제
                    MigrationTable.deleteWhere { MigrationTable.version eq migration.version }
                    
                    logger.info("Successfully rolled back migration ${migration.version}")
                } catch (e: Exception) {
                    logger.error("Failed to rollback migration ${migration.version}", e)
                    throw e
                }
            }
        }
    }

    /**
     * 마이그레이션 상태 조회
     * 
     * @return 모든 마이그레이션의 상태 목록
     */
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

/**
 * 마이그레이션 상태 데이터 클래스
 * 
 * @property version 마이그레이션 버전
 * @property description 마이그레이션 설명
 * @property appliedAt 적용 시간 (미적용 시 null)
 * @property status 상태 (APPLIED 또는 PENDING)
 */
data class MigrationStatus(
    val version: String,
    val description: String,
    val appliedAt: LocalDateTime?,
    val status: String
)

