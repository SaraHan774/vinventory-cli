package com.august.backend.repository.db

import org.jetbrains.exposed.sql.Database
import com.august.backend.repository.db.migrations.V0001Migration
import java.io.File
import org.slf4j.LoggerFactory

/**
 * 데이터베이스 팩토리
 * 
 * SQLite 데이터베이스 연결 및 마이그레이션을 관리합니다.
 */
object DatabaseFactory {
    private val logger = LoggerFactory.getLogger(DatabaseFactory::class.java)
    private val migrationManager = MigrationManager()

    /**
     * 데이터베이스 초기화
     * 
     * @param dbPath 데이터베이스 파일 경로 (기본값: vinventory.db)
     */
    fun init(dbPath: String = "vinventory.db") {
        val dbFile = File(dbPath)
        val url = "jdbc:sqlite:${dbFile.absolutePath}"
        
        // 데이터베이스 연결
        Database.connect(url, "org.sqlite.JDBC")
        
        // 마이그레이션 등록
        registerMigrations()
        
        // 마이그레이션 실행
        try {
            migrationManager.migrate()
        } catch (e: Exception) {
            logger.error("Failed to apply migrations", e)
            throw e
        }
    }
    
    /**
     * 마이그레이션 등록
     * 
     * 모든 데이터베이스 마이그레이션을 여기에 등록합니다.
     */
    private fun registerMigrations() {
        migrationManager.register(V0001Migration())
    }
    
    /**
     * 마이그레이션 상태 조회
     * 
     * @return 모든 마이그레이션의 적용 상태 목록
     */
    fun getMigrationStatus(): List<MigrationStatus> {
        return migrationManager.status()
    }
    
    /**
     * 마이그레이션 롤백
     * 
     * @param targetVersion 롤백할 대상 버전 (null이면 모두 롤백)
     */
    fun rollback(targetVersion: String? = null) {
        migrationManager.rollback(targetVersion)
    }
}

