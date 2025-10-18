-- 와인 테이블 생성 마이그레이션
-- Supabase에서 실행할 SQL 스크립트

-- 와인 테이블 생성
CREATE TABLE IF NOT EXISTS wines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    vintage INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_wines_name ON wines(name);
CREATE INDEX IF NOT EXISTS idx_wines_country_code ON wines(country_code);
CREATE INDEX IF NOT EXISTS idx_wines_vintage ON wines(vintage);
CREATE INDEX IF NOT EXISTS idx_wines_quantity ON wines(quantity);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can view wines" ON wines
    FOR SELECT USING (true);

-- 인증된 사용자만 쓰기 가능 (필요시)
CREATE POLICY "Authenticated users can insert wines" ON wines
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update wines" ON wines
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete wines" ON wines
    FOR DELETE USING (auth.role() = 'authenticated');

-- updated_at 자동 업데이트를 위한 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wines_updated_at 
    BEFORE UPDATE ON wines 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
