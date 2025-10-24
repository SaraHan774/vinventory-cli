-- 와인 노트 테이블 생성
-- Google Keep 스타일의 노트 기능을 위한 스키마

-- 와인 노트 테이블 생성
CREATE TABLE IF NOT EXISTS wine_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wine_id UUID NOT NULL REFERENCES wines(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    color VARCHAR(7) DEFAULT '#FFFFFF', -- 노트 배경색 (HEX)
    is_pinned BOOLEAN DEFAULT FALSE, -- 고정 노트 여부
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_wine_notes_wine_id ON wine_notes(wine_id);
CREATE INDEX IF NOT EXISTS idx_wine_notes_created_at ON wine_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wine_notes_is_pinned ON wine_notes(is_pinned);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE wine_notes ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can view wine notes" ON wine_notes
    FOR SELECT USING (true);

-- 인증된 사용자만 쓰기 가능
CREATE POLICY "Authenticated users can insert wine notes" ON wine_notes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update wine notes" ON wine_notes
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete wine notes" ON wine_notes
    FOR DELETE USING (auth.role() = 'authenticated');

-- updated_at 자동 업데이트를 위한 트리거
CREATE TRIGGER update_wine_notes_updated_at 
    BEFORE UPDATE ON wine_notes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 컬럼에 대한 코멘트 추가
COMMENT ON TABLE wine_notes IS '와인에 대한 노트 및 후기';
COMMENT ON COLUMN wine_notes.wine_id IS '참조하는 와인 ID';
COMMENT ON COLUMN wine_notes.title IS '노트 제목';
COMMENT ON COLUMN wine_notes.content IS '노트 내용';
COMMENT ON COLUMN wine_notes.color IS '노트 배경색 (HEX 코드)';
COMMENT ON COLUMN wine_notes.is_pinned IS '고정 노트 여부';
