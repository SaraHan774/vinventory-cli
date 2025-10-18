#!/bin/bash
# CLI 배포 스크립트

set -e

echo "🚀 CLI 배포 시작..."

# 1. 빌드
echo "📦 CLI 빌드 중..."
./gradlew :cli:build

# 2. 배포 옵션 선택
echo "배포 방식을 선택하세요:"
echo "1) GitHub Releases"
echo "2) Homebrew (macOS)"
echo "3) Chocolatey (Windows)"
echo "4) Snap (Linux)"

read -p "선택 (1-4): " choice

case $choice in
    1)
        echo "📦 GitHub Releases로 배포..."
        # GitHub CLI 필요
        gh release create v$(date +%Y%m%d) \
            --title "Vinventory CLI v$(date +%Y%m%d)" \
            --notes "CLI 업데이트" \
            cli/build/distributions/vinventory-cli-*.tar
        ;;
    2)
        echo "🍺 Homebrew로 배포..."
        # Homebrew formula 업데이트 필요
        echo "Homebrew formula를 업데이트하세요:"
        echo "https://github.com/Homebrew/homebrew-core"
        ;;
    3)
        echo "🍫 Chocolatey로 배포..."
        # Chocolatey 패키지 업데이트 필요
        choco push cli/build/distributions/vinventory-cli-*.nupkg
        ;;
    4)
        echo "📦 Snap으로 배포..."
        snapcraft upload cli/build/distributions/vinventory-cli-*.snap
        ;;
    *)
        echo "❌ 잘못된 선택입니다."
        exit 1
        ;;
esac

echo "✅ CLI 배포 완료!"
