/**
 * 외부 링크 생성 유틸리티
 * 
 * Vivino와 Wine-Searcher의 검색 URL을 자동으로 생성합니다.
 */

/**
 * Vivino 검색 URL 생성
 * 
 * @param wineName 와인 이름
 * @param vintage 빈티지 연도
 * @returns Vivino 검색 URL
 */
export function generateVivinoSearchUrl(wineName: string, vintage: number): string {
  const searchQuery = encodeURIComponent(`${wineName} ${vintage}`);
  return `https://www.vivino.com/search/wines?q=${searchQuery}`;
}

/**
 * Wine-Searcher 검색 URL 생성
 * 
 * @param wineName 와인 이름
 * @param vintage 빈티지 연도
 * @returns Wine-Searcher 검색 URL
 */
export function generateWineSearcherUrl(wineName: string, vintage: number): string {
  const searchQuery = encodeURIComponent(`${wineName} ${vintage}`);
  return `https://www.wine-searcher.com/find/${searchQuery}`;
}

/**
 * 와인 정보를 기반으로 외부 링크를 자동 생성
 * 
 * @param wineName 와인 이름
 * @param vintage 빈티지 연도
 * @param existingVivinoUrl 기존 Vivino URL (있는 경우)
 * @param existingWineSearcherUrl 기존 Wine-Searcher URL (있는 경우)
 * @returns 외부 링크 객체
 */
export function generateExternalLinks(
  wineName: string,
  vintage: number,
  existingVivinoUrl?: string | null,
  existingWineSearcherUrl?: string | null
) {
  return {
    vivino_url: existingVivinoUrl || generateVivinoSearchUrl(wineName, vintage),
    wine_searcher_url: existingWineSearcherUrl || generateWineSearcherUrl(wineName, vintage)
  };
}

/**
 * URL 유효성 검증
 * 
 * @param url 검증할 URL
 * @returns 유효한 URL인지 여부
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 외부 링크 URL 정규화
 * 
 * @param url 정규화할 URL
 * @returns 정규화된 URL 또는 null
 */
export function normalizeUrl(url: string | null | undefined): string | null {
  if (!url || url.trim() === '') {
    return null;
  }
  
  const trimmedUrl = url.trim();
  
  // http:// 또는 https://가 없으면 https:// 추가
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return `https://${trimmedUrl}`;
  }
  
  return trimmedUrl;
}
