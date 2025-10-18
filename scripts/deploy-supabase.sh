#!/bin/bash
# Supabase 기반 배포 스크립트

set -e

echo "🚀 Supabase 스택 배포 시작..."

# Supabase CLI 설치 확인
if ! command -v supabase &> /dev/null; then
    echo "📦 Supabase CLI 설치 중..."
    npm install -g supabase
fi

# 환경 변수 확인
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ SUPABASE_ACCESS_TOKEN 환경 변수가 설정되지 않았습니다."
    echo "Supabase 대시보드에서 Access Token을 생성하고 설정하세요."
    exit 1
fi

if [ -z "$SUPABASE_PROJECT_REF" ]; then
    echo "❌ SUPABASE_PROJECT_REF 환경 변수가 설정되지 않았습니다."
    echo "Supabase 프로젝트의 Reference ID를 설정하세요."
    exit 1
fi

# 배포 옵션 선택
echo "배포할 컴포넌트를 선택하세요:"
echo "1) 데이터베이스 마이그레이션"
echo "2) Edge Functions"
echo "3) 프론트엔드"
echo "4) CLI"
echo "5) 전체 스택"

read -p "선택 (1-5): " choice

case $choice in
    1)
        echo "🗄️ 데이터베이스 마이그레이션 배포..."
        supabase db push --project-ref $SUPABASE_PROJECT_REF
        ;;
    2)
        echo "⚡ Edge Functions 배포..."
        supabase functions deploy wine-management --project-ref $SUPABASE_PROJECT_REF
        ;;
    3)
        echo "🌐 프론트엔드 배포..."
        cd frontend
        npm ci
        npm run build
        # Vercel, Netlify 등으로 배포
        echo "Vercel로 배포하려면: npx vercel --prod"
        echo "Netlify로 배포하려면: npx netlify deploy --prod --dir=dist"
        ;;
    4)
        echo "💻 CLI 배포..."
        ./gradlew :cli:build
        echo "GitHub Releases로 배포하려면: gh release create"
        ;;
    5)
        echo "🚀 전체 스택 배포..."
        echo "1. 데이터베이스 마이그레이션..."
        supabase db push --project-ref $SUPABASE_PROJECT_REF
        echo "2. Edge Functions..."
        supabase functions deploy wine-management --project-ref $SUPABASE_PROJECT_REF
        echo "3. 프론트엔드 빌드..."
        cd frontend && npm ci && npm run build && cd ..
        echo "4. CLI 빌드..."
        ./gradlew :cli:build
        echo "✅ 전체 스택 배포 완료!"
        ;;
    *)
        echo "❌ 잘못된 선택입니다."
        exit 1
        ;;
esac

echo "✅ 배포 완료!"
