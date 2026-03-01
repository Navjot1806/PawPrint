import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AVATAR_SIZE = SCREEN_WIDTH * 0.25;
import Colors from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const {
    dog, dogLoading, saveDog,
    careTeam, addCareTeamMember, removeCareTeamMember,
  } = useData();

  // Local edit state mirrors Firestore dog doc
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '', breed: '', age: '', weight: '', birthday: '', microchip: '',
  });

  // Care team modal
  const [memberModal, setMemberModal] = useState(false);
  const [memberForm, setMemberForm] = useState({ name: '', role: '' });
  const [saving, setSaving] = useState(false);

  // Sync form when dog data arrives or changes
  useEffect(() => {
    if (dog) {
      setForm({
        name: dog.name || '',
        breed: dog.breed || '',
        age: dog.age || '',
        weight: dog.weight || '',
        birthday: dog.birthday || '',
        microchip: dog.microchip || '',
      });
    }
  }, [dog]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Required', 'Please enter your dog\'s name.');
      return;
    }
    setSaving(true);
    try {
      await saveDog(form);
      setEditing(false);
    } catch {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePickDogPhoto = async () => {
    Alert.alert('Dog Photo', 'Choose a source', [
      {
        text: 'Camera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera access.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3,
            base64: true,
            exif: false,
          });
          if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            const photoUri = asset.base64
              ? `data:image/jpeg;base64,${asset.base64}`
              : asset.uri;
            try {
              await saveDog({ photoUrl: photoUri });
            } catch {
              Alert.alert('Error', 'Failed to save photo.');
            }
          }
        },
      },
      {
        text: 'Library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need photo access.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3,
            base64: true,
            exif: false,
          });
          if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            const photoUri = asset.base64
              ? `data:image/jpeg;base64,${asset.base64}`
              : asset.uri;
            try {
              await saveDog({ photoUrl: photoUri });
            } catch {
              Alert.alert('Error', 'Failed to save photo.');
            }
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleAddMember = async () => {
    if (!memberForm.name.trim() || !memberForm.role.trim()) {
      Alert.alert('Required', 'Please fill in both name and role.');
      return;
    }
    setSaving(true);
    try {
      await addCareTeamMember(memberForm);
      setMemberModal(false);
      setMemberForm({ name: '', role: '' });
    } catch {
      Alert.alert('Error', 'Failed to add member.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = (member) => {
    Alert.alert(
      'Remove Member',
      `Remove ${member.name} from the care team?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeCareTeamMember(member.id),
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  if (dogLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ marginTop: 60 }} color={Colors.PRIMARY} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Pressable onPress={Keyboard.dismiss}>

        {/* Pet Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.petAvatarWrap} onPress={handlePickDogPhoto} activeOpacity={0.7}>
            {dog?.photoUrl ? (
              <Image source={{ uri: dog.photoUrl }} style={styles.petAvatar} />
            ) : (
              <View style={[styles.petAvatar, styles.petAvatarPlaceholder]}>
                <Ionicons name="paw" size={40} color={Colors.WHITE} />
              </View>
            )}
            <View style={styles.cameraOverlay}>
              <Ionicons name="camera" size={16} color={Colors.WHITE} />
            </View>
          </TouchableOpacity>
          {dog ? (
            <>
              <Text style={styles.petName}>{dog.name}</Text>
              <Text style={styles.petBreed}>{dog.breed || 'Add breed'}</Text>
            </>
          ) : (
            <>
              <Text style={styles.petName}>Your Dog</Text>
              <Text style={styles.petBreed}>Set up your dog's profile below</Text>
            </>
          )}
          <Text style={styles.photoHint}>Tap photo to change</Text>
        </View>

        {/* Pet Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pet Details</Text>
            {editing ? (
              <TouchableOpacity onPress={handleSave} disabled={saving}>
                {saving
                  ? <ActivityIndicator size="small" color={Colors.PRIMARY} />
                  : <Text style={styles.editBtn}>Save</Text>}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Text style={styles.editBtn}>{dog ? 'Edit' : '+ Set Up'}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.card}>
            <DetailRow
              icon="paw-outline"
              label="Name"
              value={form.name}
              placeholder="Dog's name"
              editing={editing}
              onChangeText={(v) => setForm({ ...form, name: v })}
            />
            <DetailRow
              icon="ribbon-outline"
              label="Breed"
              value={form.breed}
              placeholder="e.g. Golden Retriever"
              editing={editing}
              onChangeText={(v) => setForm({ ...form, breed: v })}
            />
            <DetailRow
              icon="calendar-outline"
              label="Age"
              value={form.age}
              placeholder="e.g. 3 years"
              editing={editing}
              onChangeText={(v) => setForm({ ...form, age: v })}
            />
            <DetailRow
              icon="scale-outline"
              label="Weight"
              value={form.weight}
              placeholder="e.g. 28 kg"
              editing={editing}
              onChangeText={(v) => setForm({ ...form, weight: v })}
            />
            <DetailRow
              icon="gift-outline"
              label="Birthday"
              value={form.birthday}
              placeholder="e.g. Mar 15, 2022"
              editing={editing}
              onChangeText={(v) => setForm({ ...form, birthday: v })}
            />
            <DetailRow
              icon="barcode-outline"
              label="Microchip"
              value={form.microchip}
              placeholder="Microchip ID"
              editing={editing}
              onChangeText={(v) => setForm({ ...form, microchip: v })}
              last
            />
          </View>
        </View>

        {/* Care Team */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Care Team</Text>
            <TouchableOpacity onPress={() => setMemberModal(true)}>
              <Text style={styles.editBtn}>+ Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {careTeam.length === 0 ? (
              <View style={styles.emptyRow}>
                <Ionicons name="people-outline" size={24} color={Colors.TEXT_LIGHT} />
                <Text style={styles.emptyRowText}>No care team members yet</Text>
              </View>
            ) : (
              careTeam.map((member, i) => (
                <TouchableOpacity
                  key={member.id}
                  style={[styles.teamRow, i < careTeam.length - 1 && styles.rowBorder]}
                  onLongPress={() => handleRemoveMember(member)}
                  activeOpacity={0.7}
                >
                  <View style={styles.teamAvatar}>
                    <Text style={styles.teamInitial}>
                      {member.name?.charAt(0).toUpperCase() || '?'}
                    </Text>
                  </View>
                  <View style={styles.teamInfo}>
                    <Text style={styles.teamName}>{member.name}</Text>
                    <Text style={styles.teamRole}>{member.role}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.TEXT_LIGHT} />
                </TouchableOpacity>
              ))
            )}
          </View>
          {careTeam.length > 0 && (
            <Text style={styles.hint}>Long-press a member to remove them</Text>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            <SettingsRow icon="notifications-outline" label="Notifications" onPress={() => navigation.navigate('Notifications')} />
            <SettingsRow icon="shield-outline" label="Privacy" onPress={() => navigation.navigate('Privacy')} />
            <SettingsRow icon="help-circle-outline" label="Help & Support" onPress={() => navigation.navigate('HelpSupport')} />
            <SettingsRow icon="document-text-outline" label="Terms of Service" onPress={() => navigation.navigate('TermsOfService')} last />
          </View>
        </View>

        {/* Account */}
        <View style={styles.accountCard}>
          <Ionicons name="person-circle-outline" size={20} color={Colors.TEXT_SECONDARY} />
          <Text style={styles.accountEmail}>{user?.email}</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.WARNING} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>PawPrint v1.0.0</Text>
        </Pressable>
      </ScrollView>

      {/* Add Care Team Member Modal */}
      <Modal visible={memberModal} animationType="slide" transparent>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable style={styles.modalOverlay} onPress={Keyboard.dismiss}>
            <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.modalTitle}>Add Care Team Member</Text>

              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. Sarah M."
                placeholderTextColor={Colors.TEXT_LIGHT}
                value={memberForm.name}
                onChangeText={(v) => setMemberForm({ ...memberForm, name: v })}
              />

              <Text style={styles.fieldLabel}>Role</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. Co-owner, Veterinarian, Dog Walker"
                placeholderTextColor={Colors.TEXT_LIGHT}
                value={memberForm.role}
                onChangeText={(v) => setMemberForm({ ...memberForm, role: v })}
              />

              <View style={styles.modalBtns}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => { setMemberModal(false); setMemberForm({ name: '', role: '' }); }}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleAddMember}
                  disabled={saving}
                >
                  {saving
                    ? <ActivityIndicator color={Colors.WHITE} />
                    : <Text style={styles.saveBtnText}>Add</Text>}
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function DetailRow({ icon, label, value, placeholder, editing, onChangeText, last }) {
  return (
    <View style={[styles.detailRow, !last && styles.rowBorder]}>
      <View style={styles.detailLeft}>
        <Ionicons name={icon} size={18} color={Colors.PRIMARY} />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      {editing ? (
        <TextInput
          style={styles.detailInput}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={Colors.TEXT_LIGHT}
          onChangeText={onChangeText}
        />
      ) : (
        <Text style={[styles.detailValue, !value && styles.detailEmpty]}>
          {value || placeholder}
        </Text>
      )}
    </View>
  );
}

function SettingsRow({ icon, label, last, onPress }) {
  return (
    <TouchableOpacity style={[styles.settingsRow, !last && styles.rowBorder]} onPress={onPress}>
      <View style={styles.settingsLeft}>
        <Ionicons name={icon} size={20} color={Colors.TEXT_SECONDARY} />
        <Text style={styles.settingsLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.TEXT_LIGHT} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  scroll: { paddingBottom: 100 },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: Colors.WHITE,
  },
  petAvatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  petAvatar: {
    width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2,
    backgroundColor: Colors.PRIMARY,
  },
  petAvatarPlaceholder: {
    alignItems: 'center', justifyContent: 'center',
  },
  cameraOverlay: {
    position: 'absolute', bottom: 0, right: 0,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.PRIMARY_DARK,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.WHITE,
  },
  photoHint: {
    fontSize: 12, color: Colors.TEXT_LIGHT, marginTop: 6,
  },
  petName: { fontSize: 24, fontWeight: '700', color: Colors.TEXT_PRIMARY },
  petBreed: { fontSize: 15, color: Colors.TEXT_SECONDARY, marginTop: 4 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.TEXT_PRIMARY },
  editBtn: { fontSize: 14, fontWeight: '600', color: Colors.PRIMARY },
  card: {
    backgroundColor: Colors.WHITE, borderRadius: 14, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16,
  },
  detailLeft: { flexDirection: 'row', alignItems: 'center' },
  detailLabel: { fontSize: 15, color: Colors.TEXT_SECONDARY, marginLeft: 10 },
  detailValue: { fontSize: 15, fontWeight: '600', color: Colors.TEXT_PRIMARY },
  detailEmpty: { color: Colors.TEXT_LIGHT, fontWeight: '400' },
  detailInput: {
    fontSize: 15, fontWeight: '600', color: Colors.PRIMARY,
    textAlign: 'right', minWidth: 120,
    borderBottomWidth: 1, borderBottomColor: Colors.PRIMARY, paddingBottom: 2,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.BACKGROUND },
  emptyRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 20, gap: 12,
  },
  emptyRowText: { fontSize: 14, color: Colors.TEXT_LIGHT },
  teamRow: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
  },
  teamAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.SECONDARY + '30',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  teamInitial: { fontSize: 16, fontWeight: '700', color: Colors.SECONDARY },
  teamInfo: { flex: 1 },
  teamName: { fontSize: 15, fontWeight: '600', color: Colors.TEXT_PRIMARY },
  teamRole: { fontSize: 12, color: Colors.TEXT_SECONDARY, marginTop: 2 },
  hint: { fontSize: 11, color: Colors.TEXT_LIGHT, marginTop: 6, marginLeft: 4 },
  settingsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16,
  },
  settingsLeft: { flexDirection: 'row', alignItems: 'center' },
  settingsLabel: { fontSize: 15, color: Colors.TEXT_PRIMARY, marginLeft: 12 },
  accountCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.WHITE, marginHorizontal: 20,
    marginTop: 24, padding: 16, borderRadius: 14,
  },
  accountEmail: { fontSize: 14, color: Colors.TEXT_SECONDARY, marginLeft: 10 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 20, marginTop: 16, padding: 16,
    backgroundColor: Colors.WHITE, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.WARNING + '30',
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: Colors.WARNING, marginLeft: 8 },
  version: { textAlign: 'center', fontSize: 12, color: Colors.TEXT_LIGHT, marginTop: 20 },
  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: Colors.OVERLAY,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.TEXT_PRIMARY, marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.TEXT_SECONDARY, marginBottom: 6 },
  fieldInput: {
    backgroundColor: Colors.BACKGROUND, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: Colors.TEXT_PRIMARY, marginBottom: 16,
  },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: {
    flex: 1, backgroundColor: Colors.BACKGROUND, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  cancelBtnText: { fontSize: 16, fontWeight: '600', color: Colors.TEXT_SECONDARY },
  saveBtn: {
    flex: 1, backgroundColor: Colors.PRIMARY, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: Colors.WHITE },
});
