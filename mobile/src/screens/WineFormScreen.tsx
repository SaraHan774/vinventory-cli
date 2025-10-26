/**
 * 와인 등록/수정 화면
 * 
 * 새 와인을 등록하거나 기존 와인을 수정하는 화면입니다.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { useWine, useCreateWine, useUpdateWine } from '../hooks/useWines';
import { RootStackParamList } from '../navigation/AppNavigator';
import { WineFormData } from '../types/wine';

type WineFormScreenRouteProp = RouteProp<RootStackParamList, 'WineForm'>;
type WineFormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WineForm'>;

export default function WineFormScreen() {
  const route = useRoute<WineFormScreenRouteProp>();
  const navigation = useNavigation<WineFormScreenNavigationProp>();
  const { wineId } = route.params;

  const isEditing = !!wineId;
  const { data: existingWine, isLoading } = useWine(wineId || '');
  const createWineMutation = useCreateWine();
  const updateWineMutation = useUpdateWine();

  const [formData, setFormData] = useState<WineFormData>({
    name: '',
    country_code: '',
    vintage: new Date().getFullYear(),
    price: 0,
    quantity: 0,
    vivino_url: '',
    wine_searcher_url: '',
  });

  const [errors, setErrors] = useState<Partial<WineFormData>>({});

  // 기존 와인 데이터 로드
  useEffect(() => {
    if (existingWine) {
      setFormData({
        name: existingWine.name,
        country_code: existingWine.country_code,
        vintage: existingWine.vintage,
        price: existingWine.price,
        quantity: existingWine.quantity,
        vivino_url: existingWine.vivino_url || '',
        wine_searcher_url: existingWine.wine_searcher_url || '',
      });
    }
  }, [existingWine]);

  const validateForm = (): boolean => {
    const newErrors: Partial<WineFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '와인 이름은 필수입니다.';
    }

    if (!formData.country_code.trim()) {
      newErrors.country_code = '국가 코드는 필수입니다.';
    }

    if (formData.vintage < 1900 || formData.vintage > new Date().getFullYear() + 1) {
      newErrors.vintage = '올바른 연도를 입력해주세요.';
    }

    if (formData.price < 0) {
      newErrors.price = '가격은 0 이상이어야 합니다.';
    }

    if (formData.quantity < 0) {
      newErrors.quantity = '수량은 0 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('입력 오류', '모든 필수 항목을 올바르게 입력해주세요.');
      return;
    }

    try {
      if (isEditing && wineId) {
        await updateWineMutation.mutateAsync({
          id: wineId,
          data: {
            name: formData.name,
            country_code: formData.country_code,
            vintage: formData.vintage,
            price: formData.price,
            quantity: formData.quantity,
            vivino_url: formData.vivino_url || null,
            wine_searcher_url: formData.wine_searcher_url || null,
          },
        });
        Alert.alert('성공', '와인이 성공적으로 수정되었습니다.');
      } else {
        await createWineMutation.mutateAsync({
          name: formData.name,
          country_code: formData.country_code,
          vintage: formData.vintage,
          price: formData.price,
          quantity: formData.quantity,
          vivino_url: formData.vivino_url || null,
          wine_searcher_url: formData.wine_searcher_url || null,
        });
        Alert.alert('성공', '와인이 성공적으로 등록되었습니다.');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('오류', '와인 저장에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      '취소',
      '작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?',
      [
        { text: '계속 작성', style: 'cancel' },
        { text: '취소', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
        <Text style={styles.loadingText}>와인 정보를 불러오는 중...</Text>
      </View>
    );
  }

  const isLoadingMutation = createWineMutation.isPending || updateWineMutation.isPending;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* 와인 이름 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>와인 이름 *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="예: Château Margaux"
            editable={!isLoadingMutation}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* 국가 코드 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>국가 코드 *</Text>
          <TextInput
            style={[styles.input, errors.country_code && styles.inputError]}
            value={formData.country_code}
            onChangeText={(text) => setFormData({ ...formData, country_code: text.toUpperCase() })}
            placeholder="예: FR, IT, ES"
            maxLength={2}
            editable={!isLoadingMutation}
          />
          {errors.country_code && <Text style={styles.errorText}>{errors.country_code}</Text>}
        </View>

        {/* 연도 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>연도 *</Text>
          <TextInput
            style={[styles.input, errors.vintage ? styles.inputError : null]}
            value={formData.vintage.toString()}
            onChangeText={(text) => setFormData({ ...formData, vintage: parseInt(text) || 0 })}
            placeholder="예: 2015"
            keyboardType="numeric"
            editable={!isLoadingMutation}
          />
          {errors.vintage && <Text style={styles.errorText}>{errors.vintage}</Text>}
        </View>

        {/* 가격 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>가격 (USD) *</Text>
          <TextInput
            style={[styles.input, errors.price ? styles.inputError : null]}
            value={formData.price.toString()}
            onChangeText={(text) => setFormData({ ...formData, price: parseInt(text) || 0 })}
            placeholder="예: 150"
            keyboardType="numeric"
            editable={!isLoadingMutation}
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>

        {/* 수량 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>수량 (병) *</Text>
          <TextInput
            style={[styles.input, errors.quantity ? styles.inputError : null]}
            value={formData.quantity.toString()}
            onChangeText={(text) => setFormData({ ...formData, quantity: parseInt(text) || 0 })}
            placeholder="예: 3"
            keyboardType="numeric"
            editable={!isLoadingMutation}
          />
          {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
        </View>

        {/* Vivino URL */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vivino URL</Text>
          <TextInput
            style={styles.input}
            value={formData.vivino_url}
            onChangeText={(text) => setFormData({ ...formData, vivino_url: text })}
            placeholder="https://www.vivino.com/..."
            keyboardType="url"
            editable={!isLoadingMutation}
          />
        </View>

        {/* Wine-Searcher URL */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Wine-Searcher URL</Text>
          <TextInput
            style={styles.input}
            value={formData.wine_searcher_url}
            onChangeText={(text) => setFormData({ ...formData, wine_searcher_url: text })}
            placeholder="https://www.wine-searcher.com/..."
            keyboardType="url"
            editable={!isLoadingMutation}
          />
        </View>

        {/* 버튼들 */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={isLoadingMutation}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton, isLoadingMutation && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoadingMutation}
          >
            {isLoadingMutation ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditing ? '수정' : '등록'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#8B0000',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
