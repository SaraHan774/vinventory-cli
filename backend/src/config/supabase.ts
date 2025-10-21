import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

/**
 * Supabase 클라이언트 설정
 * 
 * TypeScript 환경에서 Supabase를 사용하기 위한 클라이언트를 생성합니다.
 * 환경 변수에서 URL과 API 키를 읽어와 연결을 설정합니다.
 */
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project') || supabaseKey.includes('your-anon-key')) {
  console.warn('⚠️  Supabase 환경 변수가 설정되지 않았습니다.');
  console.warn('   SUPABASE_URL과 SUPABASE_ANON_KEY를 .env 파일에 설정해주세요.');
}

/**
 * Supabase 클라이언트 인스턴스
 * 
 * 데이터베이스 작업, 인증, 실시간 기능을 위한 클라이언트입니다.
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

/**
 * Supabase 연결 상태 확인
 * 
 * @returns Promise<boolean> 연결 성공 여부
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('wines')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase 연결 실패:', error.message);
      return false;
    }
    
    console.log('✅ Supabase 연결 성공');
    return true;
  } catch (error) {
    console.error('❌ Supabase 연결 오류:', error);
    return false;
  }
}

/**
 * 환경 변수 정보 출력 (디버깅용)
 */
export function logEnvironmentInfo(): void {
  console.log('🔧 환경 설정:');
  console.log(`   SUPABASE_URL: ${supabaseUrl}`);
  console.log(`   SUPABASE_ANON_KEY: ${supabaseKey.substring(0, 20)}...`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
}
