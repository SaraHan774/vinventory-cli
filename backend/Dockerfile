# Backend Dockerfile
# Ktor 백엔드를 Docker 컨테이너로 배포하기 위한 설정

FROM openjdk:17-jdk-slim

# 작업 디렉토리 설정
WORKDIR /app

# Gradle 래퍼와 빌드 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

# 모듈별 빌드 파일 복사
COPY shared/build.gradle.kts shared/
COPY backend/build.gradle.kts backend/

# 소스 코드 복사
COPY shared/src shared/src
COPY backend/src backend/src

# 의존성 다운로드 및 빌드
RUN ./gradlew :backend:build -x test

# 실행 가능한 JAR 파일 복사
COPY backend/build/libs/backend-*.jar app.jar

# 포트 노출
EXPOSE 8590

# 환경 변수 설정
ENV PORT=8590
ENV DATABASE_URL=jdbc:sqlite:vinventory.db

# 애플리케이션 실행
CMD ["java", "-jar", "app.jar"]
