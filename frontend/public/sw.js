// 서비스 워커 - PWA 기능을 위한 오프라인 지원
const CACHE_NAME = 'wine-inventory-v3';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon.svg'
];

// 설치 이벤트
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('캐시 열기');
        return cache.addAll(urlsToCache);
      })
  );
});

// 페치 이벤트
self.addEventListener('fetch', (event) => {
  // HTML 문서는 네트워크 우선 전략 사용
  if (event.request.mode === 'navigate' || event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // 네트워크 응답을 캐시에 저장
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // 네트워크 실패 시 캐시 사용
          return caches.match(event.request);
        })
    );
  } else {
    // 기타 리소스는 캐시 우선 전략 사용
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('이전 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
