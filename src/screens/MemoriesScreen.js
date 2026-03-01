import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import MemoryCard from '../components/MemoryCard';
import { useData } from '../contexts/DataContext';

const ACTIVITY_TYPES = ['Walk', 'Adventure', 'Health', 'Play', 'Photo', 'Recipe'];

export default function MemoriesScreen() {
  const { memories, addMemory, deleteMemory } = useData();

  const [captionModal, setCaptionModal] = useState(false);
  const [sourceModal, setSourceModal] = useState(false);
  const [pendingUri, setPendingUri] = useState(null);
  const [caption, setCaption] = useState('');
  const [activityType, setActivityType] = useState('Photo');
  const [saving, setSaving] = useState(false);

  const handleAddPress = () => {
    setSourceModal(true);
  };

  const takePhoto = async () => {
    setSourceModal(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera access to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
      base64: true,
      exif: false,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const base64Uri = asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : asset.uri;
      setPendingUri(base64Uri);
      setCaption('');
      setActivityType('Photo');
      setCaptionModal(true);
    }
  };

  const pickImage = async () => {
    setSourceModal(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need photo access to add memories.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
      base64: true,
      exif: false,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const base64Uri = asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : asset.uri;
      setPendingUri(base64Uri);
      setCaption('');
      setActivityType('Photo');
      setCaptionModal(true);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await addMemory(
        {
          caption,
          activityType,
          date: new Date().toISOString(),
        },
        pendingUri
      );
      setCaptionModal(false);
      setPendingUri(null);
    } catch (err) {
      console.error('Save memory error:', err);
      Alert.alert('Error', 'Failed to save memory: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Memories</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddPress}>
          <Ionicons name="add" size={24} color={Colors.WHITE} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={memories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MemoryCard
            memory={{
              ...item,
              photoUrl: item.imageUrl,
              date: item.date ? new Date(item.date) : new Date(),
            }}
            onDelete={() => deleteMemory(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="images-outline" size={64} color={Colors.TEXT_LIGHT} />
            <Text style={styles.emptyTitle}>No memories yet</Text>
            <Text style={styles.emptySubtitle}>Tap + to add your first photo memory</Text>
          </View>
        }
      />

      {/* Source Selection Modal */}
      <Modal visible={sourceModal} animationType="fade" transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setSourceModal(false)}>
          <Pressable style={styles.sourceSheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Add Memory</Text>

            <TouchableOpacity style={styles.sourceOption} onPress={takePhoto}>
              <View style={[styles.sourceIcon, { backgroundColor: Colors.PRIMARY + '20' }]}>
                <Ionicons name="camera" size={24} color={Colors.PRIMARY} />
              </View>
              <View style={styles.sourceInfo}>
                <Text style={styles.sourceLabel}>Take Photo</Text>
                <Text style={styles.sourceDesc}>Capture your dog or a recipe</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.TEXT_LIGHT} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.sourceOption} onPress={pickImage}>
              <View style={[styles.sourceIcon, { backgroundColor: Colors.SECONDARY + '20' }]}>
                <Ionicons name="images" size={24} color={Colors.SECONDARY} />
              </View>
              <View style={styles.sourceInfo}>
                <Text style={styles.sourceLabel}>Choose from Library</Text>
                <Text style={styles.sourceDesc}>Pick an existing photo</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.TEXT_LIGHT} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelBtn, { marginTop: 16 }]}
              onPress={() => setSourceModal(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Caption Modal */}
      <Modal visible={captionModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Pressable style={styles.modalOverlay} onPress={Keyboard.dismiss}>
            <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
              <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
                <Text style={styles.modalTitle}>Add a Caption</Text>

                <Text style={styles.fieldLabel}>Caption</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="What's happening in this photo?"
                  placeholderTextColor={Colors.TEXT_LIGHT}
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                />

                <Text style={styles.fieldLabel}>Activity Type</Text>
                <View style={styles.typeRow}>
                  {ACTIVITY_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.typeChip, activityType === type && styles.typeChipActive]}
                      onPress={() => setActivityType(type)}
                    >
                      <Text style={[styles.typeText, activityType === type && styles.typeTextActive]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.modalBtns}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => { setCaptionModal(false); setPendingUri(null); }}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                    {saving
                      ? <ActivityIndicator color={Colors.WHITE} />
                      : <Text style={styles.saveBtnText}>Save Memory</Text>}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20,
    paddingTop: 16, paddingBottom: 12,
  },
  screenTitle: { fontSize: 24, fontWeight: '700', color: Colors.TEXT_PRIMARY },
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.PRIMARY, alignItems: 'center', justifyContent: 'center',
  },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  empty: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: Colors.TEXT_PRIMARY, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: Colors.TEXT_SECONDARY, marginTop: 6 },
  modalOverlay: { flex: 1, backgroundColor: Colors.OVERLAY, justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: Colors.WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.TEXT_PRIMARY, marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.TEXT_SECONDARY, marginBottom: 8 },
  fieldInput: {
    backgroundColor: Colors.BACKGROUND, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: Colors.TEXT_PRIMARY, marginBottom: 16,
    minHeight: 70, textAlignVertical: 'top',
  },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  typeChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: Colors.BACKGROUND,
  },
  typeChipActive: { backgroundColor: Colors.PRIMARY },
  typeText: { fontSize: 13, fontWeight: '600', color: Colors.TEXT_SECONDARY },
  typeTextActive: { color: Colors.WHITE },
  modalBtns: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1, backgroundColor: Colors.BACKGROUND,
    borderRadius: 12, paddingVertical: 14, alignItems: 'center',
  },
  cancelBtnText: { fontSize: 16, fontWeight: '600', color: Colors.TEXT_SECONDARY },
  saveBtn: {
    flex: 2, backgroundColor: Colors.PRIMARY,
    borderRadius: 12, paddingVertical: 14, alignItems: 'center',
  },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: Colors.WHITE },
  sourceSheet: {
    backgroundColor: Colors.WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
  },
  sourceOption: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.BORDER,
  },
  sourceIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  sourceInfo: { flex: 1 },
  sourceLabel: { fontSize: 16, fontWeight: '600', color: Colors.TEXT_PRIMARY },
  sourceDesc: { fontSize: 13, color: Colors.TEXT_SECONDARY, marginTop: 2 },
});
