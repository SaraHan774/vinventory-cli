/**
 * 와인 노트 화면 (완전 구현)
 * 
 * Google Keep 스타일의 노트 관리 화면입니다.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { useWine } from '../hooks/useWines';
import { useWineNotes, useAllNotes, useCreateWineNote, useUpdateWineNote, useDeleteWineNote, useTogglePinWineNote, useChangeWineNoteColor } from '../hooks/useWineNotes';
import { RootStackParamList } from '../navigation/AppNavigator';
import { WineNote, NOTE_COLORS } from '../types/wineNote';

type WineNotesScreenRouteProp = RouteProp<RootStackParamList, 'WineNotes'>;
type WineNotesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WineNotes'>;

export default function WineNotesScreen() {
  const route = useRoute<WineNotesScreenRouteProp>();
  const navigation = useNavigation<WineNotesScreenNavigationProp>();
  const { wineId } = route.params || { wineId: 'all' }; // 탭에서 접근할 때는 'all' 사용

  // 탭에서 접근할 때는 wineId가 'all'이므로 와인 정보는 표시하지 않음
  const { data: wine } = useWine(wineId === 'all' ? '' : wineId);
  
  // 전체 노트 또는 특정 와인 노트 조회
  const allNotesQuery = useAllNotes();
  const wineNotesQuery = useWineNotes(wineId);
  
  const { data: notes, isLoading, error } = wineId === 'all' ? allNotesQuery : wineNotesQuery;
  const createNoteMutation = useCreateWineNote(wineId);
  const updateMutation = useUpdateWineNote(wineId);
  const deleteNoteMutation = useDeleteWineNote(wineId);
  const togglePinMutation = useTogglePinWineNote(wineId);
  const changeColorMutation = useChangeWineNoteColor(wineId);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedNoteForColor, setSelectedNoteForColor] = useState<WineNote | null>(null);
  const [editingNote, setEditingNote] = useState<WineNote | null>(null);

  // 노트 정렬 (고정된 노트 먼저, 그 다음 최신순)
  const sortedNotes = notes && Array.isArray(notes) ? [...notes].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  }) : [];

  const handleCreateNote = async (noteData: { title: string; content: string; color: string; is_pinned: boolean }) => {
    try {
      await createNoteMutation.mutateAsync(noteData);
      setShowCreateForm(false);
      Alert.alert('성공', '노트가 생성되었습니다.');
    } catch (error) {
      Alert.alert('오류', '노트 생성에 실패했습니다.');
    }
  };

  const handleDeleteNote = (note: WineNote) => {
    Alert.alert(
      '노트 삭제',
      `"${note.title}"을(를) 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteNoteMutation.mutate(note.id),
        },
      ]
    );
  };

  const handleTogglePin = async (note: WineNote) => {
    try {
      await togglePinMutation.mutateAsync({ noteId: note.id, isPinned: !note.is_pinned });
    } catch (error) {
      Alert.alert('오류', '노트 고정 상태 변경에 실패했습니다.');
    }
  };

  const handleChangeColor = async (note: WineNote, color: string) => {
    try {
      await changeColorMutation.mutateAsync({ noteId: note.id, color });
      setShowColorPicker(false);
      setSelectedNoteForColor(null);
    } catch (error) {
      Alert.alert('오류', '노트 색상 변경에 실패했습니다.');
    }
  };

  const handleEditSuccess = () => {
    setEditingNote(null);
  };

  const handleEditCancel = () => {
    setEditingNote(null);
  };

  const handleNotePress = (note: WineNote) => {
    // 노트 클릭 시 항상 편집 모드로 전환
    setEditingNote(note);
  };

  const renderNoteItem = ({ item: note }: { item: WineNote }) => (
    <TouchableOpacity
      style={[styles.noteCard, { backgroundColor: note.color }]}
      onPress={() => handleNotePress(note)}
    >
      {/* 실제 핀 UI (고정된 노트만) */}
      {note.is_pinned && (
        <View style={styles.pinOverlay}>
          <View style={styles.pinHead}>
            <Ionicons name="pin" size={16} color="#8B0000" />
          </View>
          <View style={styles.pinBody} />
        </View>
      )}
      
      {/* 노트 제목 */}
      <Text style={styles.noteTitle} numberOfLines={2}>
        {note.title}
      </Text>
      
      {/* 노트 내용 */}
      {note.content && (
        <Text style={styles.noteContent} numberOfLines={3}>
          {note.content}
        </Text>
      )}
      
      {/* 하단 정보 영역 */}
      <View style={styles.noteFooter}>
        {/* 와인 정보 (전체 노트 목록에서만) */}
        {wineId === 'all' && note.wines && (
          <View style={styles.wineInfo}>
            <View style={styles.wineInfoItem}>
              <Ionicons name="wine" size={14} color="#8B0000" />
              <Text style={styles.wineInfoText}>
                {note.wines.name} ({note.wines.vintage}) / {note.wines.country_code}
              </Text>
            </View>
          </View>
        )}
        
        {/* 액션 버튼들 */}
        <View style={styles.noteActions}>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              handleTogglePin(note);
            }}
          >
            <Ionicons
              name={note.is_pinned ? "pin" : "pin-outline"}
              size={16}
              color="#666"
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              setSelectedNoteForColor(note);
              setShowColorPicker(true);
            }}
          >
            <Ionicons name="color-palette" size={16} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              handleDeleteNote(note);
            }}
          >
            <Ionicons name="trash" size={16} color="#FF0000" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B0000" />
        <Text style={styles.loadingText}>노트를 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color="#FF0000" />
        <Text style={styles.errorText}>노트를 불러오는데 실패했습니다.</Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#8B0000" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {wineId === 'all' ? '모든 노트' : `${wine?.name} 노트`}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateForm(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {sortedNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>아직 노트가 없습니다</Text>
          <Text style={styles.emptySubtext}>첫 번째 노트를 작성해보세요</Text>
        </View>
      ) : (
        <FlatList
          data={sortedNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item: note }) => (
            editingNote?.id === note.id ? (
              <NoteForm
                wineId={wineId}
                existingNote={editingNote}
                onSubmit={async (noteData) => {
                  try {
                    await updateMutation.mutateAsync({ noteId: editingNote!.id, noteData });
                    handleEditSuccess();
                    Alert.alert('성공', '노트가 수정되었습니다.');
                  } catch (error) {
                    Alert.alert('오류', '노트 수정에 실패했습니다.');
                  }
                }}
                onCancel={handleEditCancel}
              />
            ) : (
              renderNoteItem({ item: note })
            )
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* 노트 생성 모달 */}
      <Modal
        visible={showCreateForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>새 노트 작성</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCreateForm(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <NoteForm
            wineId={wineId}
            onSubmit={handleCreateNote}
            onCancel={() => setShowCreateForm(false)}
          />
        </View>
      </Modal>

      {/* 색상 선택 모달 */}
      <Modal
        visible={showColorPicker}
        transparent
        animationType="fade"
      >
        <View style={styles.colorPickerOverlay}>
          <View style={styles.colorPickerContainer}>
            <Text style={styles.colorPickerTitle}>노트 색상 선택</Text>
            <View style={styles.colorGrid}>
              {NOTE_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedNoteForColor?.color === color && styles.selectedColor
                  ]}
                  onPress={() => selectedNoteForColor && handleChangeColor(selectedNoteForColor, color)}
                />
              ))}
            </View>
            <TouchableOpacity
              style={styles.cancelColorButton}
              onPress={() => {
                setShowColorPicker(false);
                setSelectedNoteForColor(null);
              }}
            >
              <Text style={styles.cancelColorButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 노트 작성 폼 컴포넌트
function NoteForm({ 
  wineId, 
  existingNote, 
  onSubmit, 
  onCancel 
}: { 
  wineId: string;
  existingNote?: WineNote | null;
  onSubmit: (data: any) => void; 
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [color, setColor] = useState(existingNote?.color || NOTE_COLORS[0]);
  const [isPinned, setIsPinned] = useState(existingNote?.is_pinned || false);

  // existingNote가 변경될 때 폼 데이터 업데이트
  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content || '');
      setColor(existingNote.color || NOTE_COLORS[0]);
      setIsPinned(existingNote.is_pinned);
    } else {
      setTitle('');
      setContent('');
      setColor(NOTE_COLORS[0]);
      setIsPinned(false);
    }
  }, [existingNote]);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('오류', '제목을 입력해주세요.');
      return;
    }
    onSubmit({ title: title.trim(), content: content.trim(), color, is_pinned: isPinned });
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="제목"
        maxLength={255}
      />
      <TextInput
        style={styles.contentInput}
        value={content}
        onChangeText={setContent}
        placeholder="노트 내용을 작성하세요..."
        multiline
        numberOfLines={8}
        maxLength={10000}
      />
      
      <View style={styles.formActions}>
        <TouchableOpacity
          style={styles.pinButton}
          onPress={() => setIsPinned(!isPinned)}
        >
          <Ionicons name={isPinned ? "pin" : "pin-outline"} size={20} color="#8B0000" />
          <Text style={styles.pinButtonText}>{isPinned ? '고정됨' : '고정'}</Text>
        </TouchableOpacity>

        <View style={styles.colorOptions}>
          {NOTE_COLORS.slice(0, 6).map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.colorOption, { backgroundColor: c }]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>
      </View>

      <View style={styles.formButtons}>
        <TouchableOpacity style={styles.cancelFormButton} onPress={onCancel}>
          <Text style={styles.cancelFormButtonText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitFormButton} onPress={handleSubmit}>
          <Text style={styles.submitFormButtonText}>저장</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  listContainer: {
    padding: 20,
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 160,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    position: 'relative',
  },
  // Chip 형태 국가 태그 스타일
  countryChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  countryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976D2',
    textTransform: 'uppercase',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 24,
    marginBottom: 8,
  },
  noteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: '400',
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  wineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  wineInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wineInfoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  // 실제 핀 UI 스타일
  pinOverlay: {
    position: 'absolute',
    top: -8,
    right: 16,
    zIndex: 10,
  },
  pinHead: {
    backgroundColor: '#8B0000',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  pinBody: {
    width: 2,
    height: 12,
    backgroundColor: '#8B0000',
    alignSelf: 'center',
    marginTop: -2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  noteDate: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  contentInput: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  pinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  pinButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#8B0000',
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  selectedColor: {
    borderColor: '#8B0000',
    borderWidth: 3,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelFormButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelFormButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitFormButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#8B0000',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitFormButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  colorPickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    minWidth: 300,
  },
  colorPickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 20,
  },
  cancelColorButton: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelColorButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  // 누락된 스타일들
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  addButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#8B0000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  // 와인 정보 스타일
  wineInfo: {
    flex: 1,
  },
  wineInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wineInfoText: {
    fontSize: 12,
    color: '#8B0000',
    fontWeight: '500',
  },
});