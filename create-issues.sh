#!/bin/bash

# GitHub issue 생성 스크립트
# 사용법: GITHUB_TOKEN=your_token ./create-issues.sh

set -e

# 설정
REPO_OWNER="SaraHan774"
REPO_NAME="vinventory-cli"
ISSUES_FILE="issues.json"

# GitHub token 확인
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: GITHUB_TOKEN 환경 변수가 설정되지 않았습니다."
    echo ""
    echo "사용법:"
    echo "  export GITHUB_TOKEN=your_personal_access_token"
    echo "  ./create-issues.sh"
    echo ""
    echo "또는:"
    echo "  GITHUB_TOKEN=your_token ./create-issues.sh"
    echo ""
    echo "GitHub Personal Access Token 생성 방법:"
    echo "  1. GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)"
    echo "  2. 'Generate new token' 클릭"
    echo "  3. 'repo' 권한 선택"
    echo "  4. 생성된 토큰 복사"
    exit 1
fi

# jq 설치 확인
if ! command -v jq &> /dev/null; then
    echo "❌ Error: jq가 설치되어 있지 않습니다."
    echo "설치: sudo apt-get install jq (Ubuntu/Debian) 또는 brew install jq (macOS)"
    exit 1
fi

# issues.json 파일 확인
if [ ! -f "$ISSUES_FILE" ]; then
    echo "❌ Error: $ISSUES_FILE 파일을 찾을 수 없습니다."
    exit 1
fi

echo "🚀 GitHub Issues 생성 시작..."
echo "📦 Repository: $REPO_OWNER/$REPO_NAME"
echo ""

# 성공/실패 카운터
SUCCESS_COUNT=0
FAIL_COUNT=0
TOTAL_COUNT=$(jq 'length' "$ISSUES_FILE")

echo "📋 총 $TOTAL_COUNT 개의 issue를 생성합니다."
echo ""

# 각 issue 생성
for i in $(seq 0 $((TOTAL_COUNT - 1))); do
    # JSON에서 issue 데이터 추출
    TITLE=$(jq -r ".[$i].title" "$ISSUES_FILE")
    BODY=$(jq -r ".[$i].body" "$ISSUES_FILE")
    LABELS=$(jq -r ".[$i].labels | join(\",\")" "$ISSUES_FILE")

    echo "[$((i + 1))/$TOTAL_COUNT] 생성 중: $TITLE"

    # GitHub API 호출
    RESPONSE=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/issues" \
        -d @- <<EOF
{
  "title": $(echo "$TITLE" | jq -R .),
  "body": $(echo "$BODY" | jq -Rs .),
  "labels": $(echo "$LABELS" | jq -R 'split(",") | map(select(length > 0))')
}
EOF
    )

    # HTTP 상태 코드 추출
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')

    if [ "$HTTP_CODE" = "201" ]; then
        ISSUE_NUMBER=$(echo "$RESPONSE_BODY" | jq -r '.number')
        ISSUE_URL=$(echo "$RESPONSE_BODY" | jq -r '.html_url')
        echo "  ✅ 성공: Issue #$ISSUE_NUMBER"
        echo "  🔗 $ISSUE_URL"
        ((SUCCESS_COUNT++))
    else
        echo "  ❌ 실패 (HTTP $HTTP_CODE)"
        ERROR_MSG=$(echo "$RESPONSE_BODY" | jq -r '.message // "Unknown error"')
        echo "  📄 에러: $ERROR_MSG"
        ((FAIL_COUNT++))
    fi

    echo ""

    # API rate limit 방지를 위한 대기
    if [ $i -lt $((TOTAL_COUNT - 1)) ]; then
        sleep 2
    fi
done

# 결과 요약
echo "=========================================="
echo "✅ 성공: $SUCCESS_COUNT"
echo "❌ 실패: $FAIL_COUNT"
echo "📊 총합: $TOTAL_COUNT"
echo "=========================================="

if [ $FAIL_COUNT -eq 0 ]; then
    echo "🎉 모든 issue가 성공적으로 생성되었습니다!"
    exit 0
else
    echo "⚠️  일부 issue 생성에 실패했습니다."
    exit 1
fi
