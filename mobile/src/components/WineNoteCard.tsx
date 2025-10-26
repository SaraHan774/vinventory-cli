/**
 * 와인 노트 카드 컴포넌트
 * 
 * Google Keep 스타일의 노트 카드 컴포넌트입니다.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WineNote } from '../types/wineNote';

interface WineNoteCardProps {
  note: WineNote;
  onPress?: (note: WineNote) => void;
  onEdit?: (note: WineNote) => void;
  onDelete?: (note: WineNote) => void;
  onTogglePin?: (note: WineNote) => void;
  onColorChange?: (note: WineNote) => void;
}

export default function WineNoteCard({
  note,
  onPress,
  onEdit,
  onDelete,
  onTogglePin,
  onColorChange,
}: WineNoteCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: note.color }]}
      onPress={() => onPress?.(note)}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {note.title}
        </Text>
        
        <View style={styles.actions}>
          {note.is_pinned && (
            <Ionicons name="pin" size={16} color="#666" />
          )}
          
          {onTogglePin && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onTogglePin(note)}
            >
              <Ionicons
                name={note.is_pinned ? "pin" : "pin-outline"}
                size={16}
                color="#666"
              />
            </TouchableOpacity>
          )}
          
          {onColorChange && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onColorChange(note)}
            >
              <Ionicons name="color-palette" size={16} color="#666" />
            </TouchableOpacity>
          )}
          
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(note)}
            >
              <Ionicons name="pencil" size={16} color="#666" />
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(note)}
            >
              <Ionicons name="trash" size={16} color="#FF0000" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {note.content && (
        <Text style={styles.content} numberOfLines={4}>
          {note.content}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={styles.date}>
          {new Date(note.updated_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    padding: 4,
  },
  content: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});
