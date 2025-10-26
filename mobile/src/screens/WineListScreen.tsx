/**
 * 와인 목록 화면
 * 
 * 모든 와인을 목록으로 표시하는 화면입니다.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { useWines, useDeleteWine, useSearchWines } from '../hooks/useWines';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Wine } from '../types/wine';

type WineListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WineList'>;

export default function WineListScreen() {
  const navigation = useNavigation<WineListScreenNavigationProp>();
  const { data: wines, isLoading, error } = useWines();
  const deleteWineMutation = useDeleteWine();
  
  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // 검색 기능
  const searchWinesMutation = useSearchWines();

  const handleWinePress = (wine: Wine) => {
    navigation.navigate('WineDetail', { wineId: wine.id });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('오류', '검색어를 입력해주세요.');
      return;
    }
    
    setIsSearching(true);
    try {
      await searchWinesMutation.mutateAsync(searchQuery.trim());
      setShowSearchModal(false);
      Alert.alert('성공', `"${searchQuery}" 검색 결과를 표시합니다.`);
    } catch (error) {
      Alert.alert('오류', '검색에 실패했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSearchModal(false);
  };

  const handleResetSearch = () => {
    // 검색 결과 초기화 - 모든 와인 다시 로드
    setSearchQuery('');
    setShowSearchModal(false);
    // React Query 캐시 무효화하여 전체 목록 다시 로드
    // useWines 훅이 자동으로 다시 데이터를 가져옴
  };

  const handleAddWine = () => {
    navigation.navigate('WineForm', {});
  };

  const handleEditWine = (wine: Wine) => {
    navigation.navigate('WineForm', { wineId: wine.id });
  };

  const handleDeleteWine = (wine: Wine) => {
    Alert.alert(
      '와인 삭제',
      `"${wine.name}"을(를) 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteWineMutation.mutate(wine.id),
        },
      ]
    );
  };

  const renderWineItem = ({ item: wine }: { item: Wine }) => (
    <TouchableOpacity
      style={styles.wineItem}
      onPress={() => handleWinePress(wine)}
    >
      <View style={styles.wineInfo}>
        <Text style={styles.wineName}>{wine.name}</Text>
        <Text style={styles.wineDetails}>
          {wine.country_code} • {wine.vintage}년 • {wine.quantity}병
        </Text>
        <Text style={styles.winePrice}>
          ${wine.price.toLocaleString()}
        </Text>
      </View>
      <View style={styles.wineActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditWine(wine)}
        >
          <Ionicons name="pencil" size={20} color="#8B0000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteWine(wine)}
        >
          <Ionicons name="trash" size={20} color="#FF0000" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
        <Text style={styles.loadingText}>와인 목록을 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color="#FF0000" />
        <Text style={styles.errorText}>와인 목록을 불러오는데 실패했습니다.</Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>와인 목록</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={() => setShowSearchModal(true)}
          >
            <Ionicons name="search" size={24} color="#8B0000" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={handleResetSearch}
          >
            <Ionicons name="refresh" size={24} color="#8B0000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddWine}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={wines || []}
        keyExtractor={(item) => item.id}
        renderItem={renderWineItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {/* 검색 모달 */}
      <Modal
        visible={showSearchModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.searchModal}>
          <View style={styles.searchHeader}>
            <Text style={styles.searchTitle}>와인 검색</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSearchModal(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchForm}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="와인 이름, 국가, 빈티지로 검색..."
              autoFocus
            />
            
            <View style={styles.searchButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClearSearch}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
                onPress={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.searchButtonText}>검색</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  wineItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wineInfo: {
    flex: 1,
  },
  wineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  wineDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  winePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B0000',
  },
  wineActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B0000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#8B0000',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // 헤더 스타일
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  searchButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  resetButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#8B0000',
  },
  // 검색 모달 스타일
  searchModal: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  searchForm: {
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  searchButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
