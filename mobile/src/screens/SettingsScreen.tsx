/**
 * 설정 화면
 * 
 * 앱 설정을 관리하는 화면입니다.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>설정</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 정보</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="information-circle" size={24} color="#8B0000" />
            <Text style={styles.settingText}>앱 버전</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="help-circle" size={24} color="#8B0000" />
            <Text style={styles.settingText}>도움말</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="document-text" size={24} color="#8B0000" />
            <Text style={styles.settingText}>개인정보 처리방침</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>데이터 관리</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="download" size={24} color="#8B0000" />
            <Text style={styles.settingText}>데이터 내보내기</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="cloud-upload" size={24} color="#8B0000" />
            <Text style={styles.settingText}>데이터 가져오기</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
  },
});