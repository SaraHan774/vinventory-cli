-- 와인 테이블에 외부 링크 컬럼 추가
-- Supabase에서 실행할 SQL 스크립트

-- 외부 링크 컬럼 추가
ALTER TABLE wines 
ADD COLUMN IF NOT EXISTS vivino_url TEXT,
ADD COLUMN IF NOT EXISTS wine_searcher_url TEXT;

-- 외부 링크 컬럼에 대한 인덱스 생성 (선택적)
CREATE INDEX IF NOT EXISTS idx_wines_vivino_url ON wines(vivino_url) WHERE vivino_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_wines_wine_searcher_url ON wines(wine_searcher_url) WHERE wine_searcher_url IS NOT NULL;

-- 컬럼에 대한 코멘트 추가
COMMENT ON COLUMN wines.vivino_url IS 'Vivino 와인 정보 링크';
COMMENT ON COLUMN wines.wine_searcher_url IS 'Wine-Searcher 와인 정보 링크';
