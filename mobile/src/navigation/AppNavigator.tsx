/**
 * 모바일 앱 메인 네비게이터
 * 
 * React Navigation을 사용한 앱 네비게이션 구조입니다.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// 화면 컴포넌트들
import WineListScreen from '../screens/WineListScreen';
import WineDetailScreen from '../screens/WineDetailScreen';
import WineFormScreen from '../screens/WineFormScreen';
import WineNotesScreen from '../screens/WineNotesScreen';
// import NotesScreen from '../screens/NotesScreen'; // 더 이상 사용하지 않음
import SettingsScreen from '../screens/SettingsScreen';

// 네비게이터 타입 정의
export type RootStackParamList = {
  WineList: undefined;
  WineDetail: { wineId: string };
  WineForm: { wineId?: string };
  WineNotes: { wineId: string };
  Settings: undefined;
};

export type TabParamList = {
  Wines: undefined;
  Notes: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

/**
 * 와인 관련 스택 네비게이터
 */
function WineStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#8B0000', // 와인 색상
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="WineList" 
        component={WineListScreen}
        options={{ title: '와인 목록' }}
      />
      <Stack.Screen 
        name="WineDetail" 
        component={WineDetailScreen}
        options={{ title: '와인 상세' }}
      />
      <Stack.Screen 
        name="WineForm" 
        component={WineFormScreen}
        options={{ title: '와인 등록/수정' }}
      />
      <Stack.Screen 
        name="WineNotes" 
        component={WineNotesScreen}
        options={{ title: '와인 노트' }}
      />
    </Stack.Navigator>
  );
}

/**
 * 메인 탭 네비게이터
 */
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Wines') {
            iconName = focused ? 'wine' : 'wine-outline';
          } else if (route.name === 'Notes') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8B0000',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Wines" 
        component={WineStackNavigator}
        options={{ title: '와인' }}
      />
      <Tab.Screen 
        name="Notes" 
        component={WineNotesScreen}
        options={{ title: '노트' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: '설정' }}
      />
    </Tab.Navigator>
  );
}

/**
 * 메인 앱 네비게이터
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
