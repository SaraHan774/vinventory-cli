#!/bin/bash
# 백엔드 배포 스크립트

set -e

echo "🚀 백엔드 배포 시작..."

# 1. 빌드
echo "📦 백엔드 빌드 중..."
./gradlew :backend:build

# 2. Docker 이미지 빌드
echo "🐳 Docker 이미지 빌드 중..."
docker build -f backend/Dockerfile -t vinventory-backend:latest .

# 3. 배포 옵션 선택
echo "배포 방식을 선택하세요:"
echo "1) Docker Compose (로컬)"
echo "2) AWS ECS"
echo "3) Google Cloud Run"
echo "4) Heroku"

read -p "선택 (1-4): " choice

case $choice in
    1)
        echo "🐳 Docker Compose로 배포..."
        docker-compose up -d backend
        ;;
    2)
        echo "☁️ AWS ECS로 배포..."
        # AWS CLI 설정 필요
        aws ecs update-service --cluster vinventory --service backend --force-new-deployment
        ;;
    3)
        echo "☁️ Google Cloud Run으로 배포..."
        gcloud run deploy vinventory-backend --image vinventory-backend:latest --platform managed --region asia-northeast1
        ;;
    4)
        echo "☁️ Heroku로 배포..."
        heroku container:push web -a vinventory-backend
        heroku container:release web -a vinventory-backend
        ;;
    *)
        echo "❌ 잘못된 선택입니다."
        exit 1
        ;;
esac

echo "✅ 백엔드 배포 완료!"
