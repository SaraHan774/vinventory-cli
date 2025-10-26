/**
 * Vinventory 모바일 앱 메인 컴포넌트
 * 
 * React Query와 Navigation을 설정한 메인 앱입니다.
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5분
      cacheTime: 10 * 60 * 1000, // 10분
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AppNavigator />
        <StatusBar style="light" backgroundColor="#8B0000" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}