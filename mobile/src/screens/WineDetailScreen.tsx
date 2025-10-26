/**
 * 와인 상세 화면
 * 
 * 특정 와인의 상세 정보를 표시하는 화면입니다.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { useWine, useDeleteWine } from '../hooks/useWines';
import { RootStackParamList } from '../navigation/AppNavigator';

type WineDetailScreenRouteProp = RouteProp<RootStackParamList, 'WineDetail'>;
type WineDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WineDetail'>;

export default function WineDetailScreen() {
  const route = useRoute<WineDetailScreenRouteProp>();
  const navigation = useNavigation<WineDetailScreenNavigationProp>();
  const { wineId } = route.params;

  const { data: wine, isLoading, error } = useWine(wineId);
  const deleteWineMutation = useDeleteWine();

  const handleEditWine = () => {
    navigation.navigate('WineForm', { wineId });
  };

  const handleDeleteWine = () => {
    if (!wine) return;

    Alert.alert(
      '와인 삭제',
      `"${wine.name}"을(를) 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            deleteWineMutation.mutate(wineId, {
              onSuccess: () => {
                navigation.goBack();
              },
            });
          },
        },
      ]
    );
  };

  const handleViewNotes = () => {
    navigation.navigate('WineNotes', { wineId });
  };

  const handleExternalLink = (url: string) => {
    Linking.openURL(url).catch((err) => {
      Alert.alert('오류', '링크를 열 수 없습니다.');
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
        <Text style={styles.loadingText}>와인 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (error || !wine) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color="#FF0000" />
        <Text style={styles.errorText}>와인 정보를 불러오는데 실패했습니다.</Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.wineName}>{wine.name}</Text>
        <Text style={styles.wineVintage}>{wine.vintage}년</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Ionicons name="flag" size={20} color="#8B0000" />
          <Text style={styles.infoLabel}>국가:</Text>
          <Text style={styles.infoValue}>{wine.country_code}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="cash" size={20} color="#8B0000" />
          <Text style={styles.infoLabel}>가격:</Text>
          <Text style={styles.infoValue}>${wine.price.toLocaleString()}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="wine" size={20} color="#8B0000" />
          <Text style={styles.infoLabel}>수량:</Text>
          <Text style={[
            styles.infoValue,
            wine.quantity <= 5 && styles.lowStockText
          ]}>
            {wine.quantity}병
            {wine.quantity <= 5 && ' (저재고)'}
          </Text>
        </View>
      </View>

      {/* 외부 링크 섹션 */}
      {(wine.vivino_url || wine.wine_searcher_url) && (
        <View style={styles.externalLinksSection}>
          <Text style={styles.sectionTitle}>외부 정보</Text>
          
          {wine.vivino_url && (
            <TouchableOpacity
              style={styles.externalLinkButton}
              onPress={() => handleExternalLink(wine.vivino_url!)}
            >
              <Ionicons name="wine" size={20} color="#8B0000" />
              <Text style={styles.externalLinkText}>Vivino에서 보기</Text>
              <Ionicons name="open-outline" size={16} color="#666" />
            </TouchableOpacity>
          )}

          {wine.wine_searcher_url && (
            <TouchableOpacity
              style={styles.externalLinkButton}
              onPress={() => handleExternalLink(wine.wine_searcher_url!)}
            >
              <Ionicons name="search" size={20} color="#8B0000" />
              <Text style={styles.externalLinkText}>Wine-Searcher에서 보기</Text>
              <Ionicons name="open-outline" size={16} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 액션 버튼들 */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleViewNotes}
        >
          <Ionicons name="document-text" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>노트 보기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEditWine}
        >
          <Ionicons name="pencil" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>수정</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteWine}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>

      {/* 메타 정보 */}
      <View style={styles.metaSection}>
        <Text style={styles.metaText}>
          생성일: {new Date(wine.created_at).toLocaleDateString()}
        </Text>
        <Text style={styles.metaText}>
          수정일: {new Date(wine.updated_at).toLocaleDateString()}
        </Text>
      </View>
    </ScrollView>
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  wineName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  wineVintage: {
    fontSize: 18,
    color: '#8B0000',
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
    marginRight: 8,
    minWidth: 60,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  lowStockText: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  externalLinksSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  externalLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  externalLinkText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  actionSection: {
    flexDirection: 'row',
    margin: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#8B0000',
  },
  editButton: {
    backgroundColor: '#0066CC',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  metaSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
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
});
