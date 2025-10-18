#!/bin/bash
# 프론트엔드 배포 스크립트

set -e

echo "🚀 프론트엔드 배포 시작..."

cd frontend

# 1. 의존성 설치
echo "📦 의존성 설치 중..."
npm ci

# 2. 빌드
echo "🔨 프로덕션 빌드 중..."
npm run build

# 3. 배포 옵션 선택
echo "배포 방식을 선택하세요:"
echo "1) Vercel"
echo "2) Netlify"
echo "3) AWS S3 + CloudFront"
echo "4) Docker"

read -p "선택 (1-4): " choice

case $choice in
    1)
        echo "☁️ Vercel로 배포..."
        npx vercel --prod
        ;;
    2)
        echo "☁️ Netlify로 배포..."
        npx netlify deploy --prod --dir=dist
        ;;
    3)
        echo "☁️ AWS S3로 배포..."
        aws s3 sync dist/ s3://vinventory-frontend --delete
        aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
        ;;
    4)
        echo "🐳 Docker로 배포..."
        docker build -t vinventory-frontend:latest .
        docker run -p 80:80 vinventory-frontend:latest
        ;;
    *)
        echo "❌ 잘못된 선택입니다."
        exit 1
        ;;
esac

echo "✅ 프론트엔드 배포 완료!"
