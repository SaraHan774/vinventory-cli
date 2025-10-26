/**
 * 와인 카드 컴포넌트
 * 
 * 와인 목록에서 사용하는 카드 컴포넌트입니다.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Wine } from '../types/wine';

interface WineCardProps {
  wine: Wine;
  onPress: (wine: Wine) => void;
  onEdit?: (wine: Wine) => void;
  onDelete?: (wine: Wine) => void;
}

export default function WineCard({ wine, onPress, onEdit, onDelete }: WineCardProps) {
  const isLowStock = wine.quantity <= 5;

  return (
    <TouchableOpacity
      style={[styles.card, isLowStock && styles.lowStockCard]}
      onPress={() => onPress(wine)}
    >
      <View style={styles.header}>
        <View style={styles.wineInfo}>
          <Text style={styles.wineName} numberOfLines={1}>
            {wine.name}
          </Text>
          <Text style={styles.wineDetails}>
            {wine.country_code} • {wine.vintage}년
          </Text>
        </View>
        
        {isLowStock && (
          <View style={styles.lowStockBadge}>
            <Ionicons name="warning" size={12} color="#fff" />
            <Text style={styles.lowStockText}>저재고</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.priceRow}>
          <Ionicons name="cash" size={16} color="#8B0000" />
          <Text style={styles.price}>
            ${wine.price.toLocaleString()}
          </Text>
        </View>

        <View style={styles.quantityRow}>
          <Ionicons name="wine" size={16} color="#8B0000" />
          <Text style={[styles.quantity, isLowStock && styles.lowStockText]}>
            {wine.quantity}병
          </Text>
        </View>
      </View>

      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(wine)}
            >
              <Ionicons name="pencil" size={16} color="#8B0000" />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(wine)}
            >
              <Ionicons name="trash" size={16} color="#FF0000" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lowStockCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF0000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  wineInfo: {
    flex: 1,
    marginRight: 8,
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
  },
  lowStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lowStockText: {
    color: '#FF0000',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B0000',
    marginLeft: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  quantity: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
});
