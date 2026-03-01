import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Switch,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Notifications handled in-app — no native module needed
import { Dimensions } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { getGreeting, formatDistance, formatTime } from '../utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import Colors from '../theme/colors';
import ProgressRing from '../components/ProgressRing';
import SnapshotCard from '../components/SnapshotCard';
import FAB from '../components/FAB';
import UpNextItem from '../components/UpNextItem';

const REMINDER_TYPES = [
  { key: 'food', label: 'Food / Meal', icon: 'restaurant-outline', color: Colors.PRIMARY },
  { key: 'walk', label: 'Walk', icon: 'walk-outline', color: Colors.SECONDARY },
  { key: 'water', label: 'Water', icon: 'water-outline', color: '#3498DB' },
  { key: 'medicine', label: 'Medicine', icon: 'medkit-outline', color: '#E74C3C' },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { dog, walks, feedings, addFeeding, deleteFeeding, reminders, addReminder, deleteReminder } = useData();
  const displayName = user?.displayName || 'Pet Parent';

  const [dogProfileModal, setDogProfileModal] = useState(false);
  const [feedModal, setFeedModal] = useState(false);
  const [feedNote, setFeedNote] = useState('');

  // Reminder modal state
  const [reminderModal, setReminderModal] = useState(false);
  const [reminderType, setReminderType] = useState('food');
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderHour, setReminderHour] = useState('08');
  const [reminderMinute, setReminderMinute] = useState('00');
  const [reminderRepeat, setReminderRepeat] = useState(true);

  // Today's feedings
  const todayFeedings = feedings.filter((f) => {
    const d = f.date ? new Date(f.date) : null;
    return d && d.toDateString() === new Date().toDateString();
  });

  const handleLogMeal = async () => {
    await addFeeding({ note: feedNote.trim(), date: new Date().toISOString() });
    setFeedNote('');
    setFeedModal(false);
  };

  const handleDeleteFeeding = (feeding) => {
    Alert.alert('Remove Meal', 'Remove this meal log?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteFeeding(feeding.id) },
    ]);
  };

  // Today's walks
  const todayWalks = walks.filter((w) => {
    const d = w.date ? new Date(w.date) : null;
    return d && d.toDateString() === new Date().toDateString();
  });
  const todayDistance = todayWalks.reduce((sum, w) => sum + (w.distance || 0), 0);
  const activityProgress = Math.min(todayWalks.length / 3, 1);

  const handleFabAction = (action) => {
    if (action === 'walk') navigation.navigate('Activity');
    if (action === 'photo') navigation.navigate('Memories');
    if (action === 'reminder') openReminderModal();
  };

  const openReminderModal = () => {
    setReminderType('food');
    setReminderTitle('');
    setReminderHour('08');
    setReminderMinute('00');
    setReminderRepeat(true);
    setReminderModal(true);
  };

  const handleSaveReminder = async () => {
    const h = parseInt(reminderHour, 10);
    const m = parseInt(reminderMinute, 10);
    if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) {
      Alert.alert('Invalid Time', 'Please enter a valid time (00-23 for hour, 00-59 for minute).');
      return;
    }
    const padH = String(h).padStart(2, '0');
    const padM = String(m).padStart(2, '0');

    const selectedType = REMINDER_TYPES.find((t) => t.key === reminderType);
    const title = reminderTitle.trim() || `${selectedType.label} Reminder`;

    try {
      await addReminder({
        type: reminderType,
        title,
        hour: padH,
        minute: padM,
        repeat: reminderRepeat,
        date: new Date().toISOString(),
      });

      setReminderModal(false);
      Alert.alert('Reminder Set', `${title} at ${padH}:${padM}${reminderRepeat ? ' (daily)' : ''}`);
    } catch (err) {
      console.error('Reminder error:', err);
      Alert.alert('Error', 'Failed to set reminder: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteReminder = (reminder) => {
    Alert.alert('Delete Reminder', `Remove "${reminder.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteReminder(reminder.id),
      },
    ]);
  };

  const getReminderIcon = (type) => {
    const found = REMINDER_TYPES.find((t) => t.key === type);
    return found ? found.icon : 'alarm-outline';
  };

  const getReminderColor = (type) => {
    const found = REMINDER_TYPES.find((t) => t.key === type);
    return found ? found.color : Colors.PRIMARY;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.name}>{displayName}</Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={() => setDogProfileModal(true)} activeOpacity={0.8}>
            {dog?.photoUrl ? (
              <Image source={{ uri: dog.photoUrl }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="paw" size={28} color={Colors.WHITE} />
            )}
          </TouchableOpacity>
        </View>

        {/* Dog name chip */}
        {dog && (
          <View style={styles.dogChip}>
            <Ionicons name="paw" size={14} color={Colors.PRIMARY} />
            <Text style={styles.dogChipText}>{dog.name}</Text>
            {dog.breed ? <Text style={styles.dogChipBreed}> · {dog.breed}</Text> : null}
          </View>
        )}

        {/* Snapshot Cards */}
        <Text style={styles.sectionTitle}>Today's Snapshot</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsRow}
        >
          <SnapshotCard>
            <ProgressRing size={90} progress={activityProgress} label="Activity" />
          </SnapshotCard>

          <SnapshotCard
            icon="walk-outline"
            iconColor="#9B59B6"
            title="Walks Today"
            value={todayWalks.length > 0 ? `${todayWalks.length} walk${todayWalks.length > 1 ? 's' : ''}` : 'No walks yet'}
            subtitle={todayDistance > 0 ? `${formatDistance(todayDistance)} total` : 'Start a walk!'}
          />

          <SnapshotCard
            icon="time-outline"
            iconColor={Colors.SECONDARY}
            title="Walk Time"
            value={todayWalks.length > 0
              ? formatTime(todayWalks.reduce((s, w) => s + (w.duration || 0), 0))
              : '0:00'}
            subtitle="today"
          />
        </ScrollView>

        {/* Feeding Tracker */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Feeding</Text>
          <TouchableOpacity style={styles.logMealBtn} onPress={() => { setFeedNote(''); setFeedModal(true); }}>
            <Ionicons name="add" size={16} color={Colors.WHITE} />
            <Text style={styles.logMealBtnText}>Log Meal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.feedingCard}>
          <View style={styles.feedingCountRow}>
            <View style={styles.feedingCountBadge}>
              <Text style={styles.feedingCountNum}>{todayFeedings.length}</Text>
            </View>
            <Text style={styles.feedingCountLabel}>
              {todayFeedings.length === 1 ? 'meal logged today' : 'meals logged today'}
            </Text>
          </View>
          {todayFeedings.length === 0 ? (
            <View style={styles.feedingEmpty}>
              <Ionicons name="restaurant-outline" size={28} color={Colors.TEXT_LIGHT} />
              <Text style={styles.feedingEmptyText}>No meals logged yet</Text>
            </View>
          ) : (
            todayFeedings.map((f, i) => (
              <TouchableOpacity
                key={f.id}
                style={[styles.feedingRow, i < todayFeedings.length - 1 && styles.feedingRowBorder]}
                onLongPress={() => handleDeleteFeeding(f)}
                activeOpacity={0.7}
              >
                <View style={styles.feedingDot} />
                <View style={styles.feedingInfo}>
                  <Text style={styles.feedingTime}>
                    {new Date(f.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  {f.note ? <Text style={styles.feedingNote}>{f.note}</Text> : null}
                </View>
                <Ionicons name="restaurant-outline" size={16} color={Colors.TEXT_LIGHT} />
              </TouchableOpacity>
            ))
          )}
          {todayFeedings.length > 0 && (
            <Text style={styles.feedingHint}>Long-press a meal to remove it</Text>
          )}
        </View>

        {/* Up Next / Reminders */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Up Next</Text>
          <TouchableOpacity style={styles.logMealBtn} onPress={openReminderModal}>
            <Ionicons name="add" size={16} color={Colors.WHITE} />
            <Text style={styles.logMealBtnText}>Set Reminder</Text>
          </TouchableOpacity>
        </View>

        {reminders.length === 0 ? (
          <View style={styles.emptyUpNext}>
            <Ionicons name="alarm-outline" size={40} color={Colors.TEXT_LIGHT} />
            <Text style={styles.emptyUpNextTitle}>No reminders yet</Text>
            <Text style={styles.emptyUpNextSub}>
              Set reminders for feeding, walking, water, or medicine
            </Text>
          </View>
        ) : (
          reminders.map((r) => (
            <UpNextItem
              key={r.id}
              title={r.title}
              time={`${r.hour}:${r.minute}${r.repeat ? '  ·  Daily' : '  ·  Once'}`}
              dotColor={getReminderColor(r.type)}
              icon={getReminderIcon(r.type)}
              onPress={() => handleDeleteReminder(r)}
            />
          ))
        )}

      </ScrollView>

      <FAB onAction={handleFabAction} />

      {/* Log Meal Modal */}
      <Modal visible={feedModal} animationType="slide" transparent>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable style={styles.modalOverlay} onPress={Keyboard.dismiss}>
            <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.modalTitle}>Log a Meal</Text>
              <Text style={styles.fieldLabel}>Note (optional)</Text>
              <TextInput
                style={styles.fieldInput}
                placeholder="e.g. Breakfast – dry kibble"
                placeholderTextColor={Colors.TEXT_LIGHT}
                value={feedNote}
                onChangeText={setFeedNote}
              />
              <View style={styles.modalBtns}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setFeedModal(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleLogMeal}>
                  <Text style={styles.saveBtnText}>Log Meal</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* Set Reminder Modal */}
      <Modal visible={reminderModal} animationType="slide" transparent>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable style={styles.modalOverlay} onPress={Keyboard.dismiss}>
            <Pressable style={styles.reminderSheet} onPress={(e) => e.stopPropagation()}>
              <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
                <Text style={styles.modalTitle}>Set Reminder</Text>

                {/* Reminder Type */}
                <Text style={styles.fieldLabel}>Reminder Type</Text>
                <View style={styles.typeGrid}>
                  {REMINDER_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.key}
                      style={[
                        styles.reminderTypeCard,
                        reminderType === type.key && { borderColor: type.color, borderWidth: 2 },
                      ]}
                      onPress={() => setReminderType(type.key)}
                    >
                      <View style={[styles.reminderTypeIcon, { backgroundColor: type.color + '20' }]}>
                        <Ionicons name={type.icon} size={22} color={type.color} />
                      </View>
                      <Text style={[
                        styles.reminderTypeLabel,
                        reminderType === type.key && { color: type.color, fontWeight: '700' },
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Title */}
                <Text style={styles.fieldLabel}>Title (optional)</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder={`e.g. ${reminderType === 'food' ? 'Breakfast time' : 'Evening walk'}`}
                  placeholderTextColor={Colors.TEXT_LIGHT}
                  value={reminderTitle}
                  onChangeText={setReminderTitle}
                />

                {/* Time Picker */}
                <Text style={styles.fieldLabel}>Time</Text>
                <View style={styles.timeRow}>
                  <View style={styles.timeInputWrap}>
                    <TextInput
                      style={styles.timeInput}
                      value={reminderHour}
                      onChangeText={(t) => setReminderHour(t.replace(/[^0-9]/g, '').slice(0, 2))}
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="HH"
                      placeholderTextColor={Colors.TEXT_LIGHT}
                    />
                    <Text style={styles.timeLabel}>Hour</Text>
                  </View>
                  <Text style={styles.timeColon}>:</Text>
                  <View style={styles.timeInputWrap}>
                    <TextInput
                      style={styles.timeInput}
                      value={reminderMinute}
                      onChangeText={(t) => setReminderMinute(t.replace(/[^0-9]/g, '').slice(0, 2))}
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="MM"
                      placeholderTextColor={Colors.TEXT_LIGHT}
                    />
                    <Text style={styles.timeLabel}>Min</Text>
                  </View>
                </View>

                {/* Repeat Toggle */}
                <View style={styles.repeatRow}>
                  <View>
                    <Text style={styles.repeatLabel}>Repeat Daily</Text>
                    <Text style={styles.repeatDesc}>Get reminded every day at this time</Text>
                  </View>
                  <Switch
                    value={reminderRepeat}
                    onValueChange={setReminderRepeat}
                    trackColor={{ false: Colors.BORDER, true: Colors.PRIMARY + '60' }}
                    thumbColor={reminderRepeat ? Colors.PRIMARY : '#f4f4f4'}
                  />
                </View>

                {/* Buttons */}
                <View style={styles.modalBtns}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setReminderModal(false)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleSaveReminder}>
                    <Text style={styles.saveBtnText}>Set Reminder</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* Dog Profile Modal */}
      <Modal visible={dogProfileModal} animationType="slide" transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setDogProfileModal(false)}>
          <Pressable style={styles.dogProfileSheet} onPress={(e) => e.stopPropagation()}>
            {/* Orange Header */}
            <View style={styles.dogProfileHeader}>
              <View style={styles.dogProfileAvatarWrap}>
                {dog?.photoUrl ? (
                  <Image source={{ uri: dog.photoUrl }} style={styles.dogProfileAvatar} />
                ) : (
                  <View style={[styles.dogProfileAvatar, styles.dogProfileAvatarPlaceholder]}>
                    <Ionicons name="paw" size={44} color={Colors.WHITE} />
                  </View>
                )}
              </View>
              <Text style={styles.dogProfileName}>{dog?.name || 'Your Dog'}</Text>
              {dog?.breed ? <Text style={styles.dogProfileBreed}>{dog.breed}</Text> : null}
              <TouchableOpacity style={styles.dogProfileClose} onPress={() => setDogProfileModal(false)}>
                <Ionicons name="close" size={22} color={Colors.WHITE} />
              </TouchableOpacity>
            </View>

            {/* Info Rows */}
            <View style={styles.dogProfileBody}>
              <View style={styles.dogProfileRow}>
                <View style={styles.dogProfileIconWrap}>
                  <Ionicons name="calendar-outline" size={18} color={Colors.PRIMARY} />
                </View>
                <Text style={styles.dogProfileLabel}>Age</Text>
                <Text style={styles.dogProfileValue}>{dog?.age || '—'}</Text>
              </View>
              <View style={styles.dogProfileDivider} />

              <View style={styles.dogProfileRow}>
                <View style={styles.dogProfileIconWrap}>
                  <Ionicons name="scale-outline" size={18} color={Colors.PRIMARY} />
                </View>
                <Text style={styles.dogProfileLabel}>Weight</Text>
                <Text style={styles.dogProfileValue}>{dog?.weight || '—'}</Text>
              </View>
              <View style={styles.dogProfileDivider} />

              <View style={styles.dogProfileRow}>
                <View style={styles.dogProfileIconWrap}>
                  <Ionicons name="gift-outline" size={18} color={Colors.PRIMARY} />
                </View>
                <Text style={styles.dogProfileLabel}>Birthday</Text>
                <Text style={styles.dogProfileValue}>{dog?.birthday || '—'}</Text>
              </View>
              <View style={styles.dogProfileDivider} />

              <View style={styles.dogProfileRow}>
                <View style={styles.dogProfileIconWrap}>
                  <Ionicons name="barcode-outline" size={18} color={Colors.PRIMARY} />
                </View>
                <Text style={styles.dogProfileLabel}>Microchip</Text>
                <Text style={styles.dogProfileValue}>{dog?.microchip || '—'}</Text>
              </View>

              {/* Stats Summary */}
              <View style={styles.dogProfileStats}>
                <View style={styles.dogProfileStatItem}>
                  <Text style={styles.dogProfileStatNum}>{todayWalks.length}</Text>
                  <Text style={styles.dogProfileStatLabel}>Walks Today</Text>
                </View>
                <View style={styles.dogProfileStatDivider} />
                <View style={styles.dogProfileStatItem}>
                  <Text style={styles.dogProfileStatNum}>{todayFeedings.length}</Text>
                  <Text style={styles.dogProfileStatLabel}>Meals Today</Text>
                </View>
                <View style={styles.dogProfileStatDivider} />
                <View style={styles.dogProfileStatItem}>
                  <Text style={styles.dogProfileStatNum}>{todayDistance > 0 ? formatDistance(todayDistance) : '0'}</Text>
                  <Text style={styles.dogProfileStatLabel}>Distance</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.dogProfileEditBtn}
                onPress={() => { setDogProfileModal(false); navigation.navigate('Profile'); }}
              >
                <Ionicons name="create-outline" size={18} color={Colors.WHITE} />
                <Text style={styles.dogProfileEditText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  scroll: { padding: 20, paddingBottom: 120 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  greeting: { fontSize: 14, color: Colors.TEXT_SECONDARY },
  name: { fontSize: 24, fontWeight: '700', color: Colors.TEXT_PRIMARY, marginTop: 2 },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: Colors.PRIMARY, alignItems: 'center', justifyContent: 'center',
  },
  dogChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.PRIMARY + '18', alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 20,
  },
  dogChipText: { fontSize: 13, fontWeight: '700', color: Colors.PRIMARY, marginLeft: 5 },
  dogChipBreed: { fontSize: 13, color: Colors.PRIMARY_DARK },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.TEXT_PRIMARY, marginBottom: 14 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14, marginTop: 8,
  },
  cardsRow: { paddingBottom: 20 },
  emptyUpNext: {
    backgroundColor: Colors.WHITE, borderRadius: 16,
    padding: 32, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  emptyUpNextTitle: {
    fontSize: 16, fontWeight: '600', color: Colors.TEXT_PRIMARY, marginTop: 12,
  },
  emptyUpNextSub: {
    fontSize: 13, color: Colors.TEXT_SECONDARY, marginTop: 6,
    textAlign: 'center', lineHeight: 20,
  },
  logMealBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.PRIMARY, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6, gap: 4,
  },
  logMealBtnText: { fontSize: 13, fontWeight: '700', color: Colors.WHITE },
  feedingCard: {
    backgroundColor: Colors.WHITE, borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
    overflow: 'hidden',
  },
  feedingCountRow: {
    flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12,
  },
  feedingCountBadge: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.PRIMARY + '18',
    alignItems: 'center', justifyContent: 'center',
  },
  feedingCountNum: { fontSize: 18, fontWeight: '800', color: Colors.PRIMARY },
  feedingCountLabel: { fontSize: 14, color: Colors.TEXT_SECONDARY, fontWeight: '500' },
  feedingEmpty: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingBottom: 16,
  },
  feedingEmptyText: { fontSize: 13, color: Colors.TEXT_LIGHT },
  feedingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, gap: 12,
  },
  feedingRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.BACKGROUND },
  feedingDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.PRIMARY,
  },
  feedingInfo: { flex: 1 },
  feedingTime: { fontSize: 14, fontWeight: '600', color: Colors.TEXT_PRIMARY },
  feedingNote: { fontSize: 12, color: Colors.TEXT_SECONDARY, marginTop: 2 },
  feedingHint: {
    fontSize: 11, color: Colors.TEXT_LIGHT,
    paddingHorizontal: 16, paddingBottom: 10,
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
  },
  reminderSheet: {
    backgroundColor: Colors.WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40, maxHeight: '90%',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.TEXT_PRIMARY, marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.TEXT_SECONDARY, marginBottom: 8 },
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
    flex: 2, backgroundColor: Colors.PRIMARY, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: Colors.WHITE },
  typeGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16,
  },
  reminderTypeCard: {
    width: '47%', flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.BACKGROUND, borderRadius: 12,
    padding: 12, gap: 10, borderWidth: 2, borderColor: 'transparent',
  },
  reminderTypeIcon: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  reminderTypeLabel: {
    fontSize: 13, fontWeight: '600', color: Colors.TEXT_PRIMARY, flex: 1,
  },
  timeRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8,
  },
  timeInputWrap: { alignItems: 'center' },
  timeInput: {
    backgroundColor: Colors.BACKGROUND, borderRadius: 12,
    width: SCREEN_WIDTH * 0.18, height: SCREEN_WIDTH * 0.14, textAlign: 'center',
    fontSize: 24, fontWeight: '700', color: Colors.TEXT_PRIMARY,
  },
  timeLabel: { fontSize: 11, color: Colors.TEXT_LIGHT, marginTop: 4 },
  timeColon: { fontSize: 28, fontWeight: '700', color: Colors.TEXT_PRIMARY, marginBottom: 16 },
  repeatRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', backgroundColor: Colors.BACKGROUND,
    borderRadius: 12, padding: 14, marginBottom: 16,
  },
  repeatLabel: { fontSize: 15, fontWeight: '600', color: Colors.TEXT_PRIMARY },
  repeatDesc: { fontSize: 12, color: Colors.TEXT_SECONDARY, marginTop: 2 },
  // Avatar image
  avatarImage: {
    width: 50, height: 50, borderRadius: 25,
  },
  // Dog Profile Modal
  dogProfileSheet: {
    backgroundColor: Colors.WHITE, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  dogProfileHeader: {
    backgroundColor: Colors.PRIMARY, alignItems: 'center',
    paddingTop: 28, paddingBottom: 24, position: 'relative',
  },
  dogProfileClose: {
    position: 'absolute', top: 16, right: 16,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  dogProfileAvatarWrap: {
    marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  dogProfileAvatar: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 3, borderColor: Colors.WHITE,
  },
  dogProfileAvatarPlaceholder: {
    backgroundColor: Colors.PRIMARY_DARK,
    alignItems: 'center', justifyContent: 'center',
  },
  dogProfileName: {
    fontSize: 24, fontWeight: '800', color: Colors.WHITE,
  },
  dogProfileBreed: {
    fontSize: 15, color: 'rgba(255,255,255,0.85)', marginTop: 4,
  },
  dogProfileBody: {
    padding: 20, paddingBottom: 36,
  },
  dogProfileRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
  },
  dogProfileIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.PRIMARY + '18',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  dogProfileLabel: {
    fontSize: 14, color: Colors.TEXT_SECONDARY, flex: 1,
  },
  dogProfileValue: {
    fontSize: 15, fontWeight: '600', color: Colors.TEXT_PRIMARY,
  },
  dogProfileDivider: {
    height: 1, backgroundColor: Colors.BACKGROUND,
  },
  dogProfileStats: {
    flexDirection: 'row', backgroundColor: Colors.PRIMARY + '12',
    borderRadius: 14, padding: 16, marginTop: 20, marginBottom: 16,
  },
  dogProfileStatItem: {
    flex: 1, alignItems: 'center',
  },
  dogProfileStatNum: {
    fontSize: 18, fontWeight: '800', color: Colors.PRIMARY,
  },
  dogProfileStatLabel: {
    fontSize: 11, color: Colors.TEXT_SECONDARY, marginTop: 4,
  },
  dogProfileStatDivider: {
    width: 1, backgroundColor: Colors.PRIMARY + '30',
  },
  dogProfileEditBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.PRIMARY, borderRadius: 14,
    paddingVertical: 14, gap: 8,
  },
  dogProfileEditText: {
    fontSize: 16, fontWeight: '700', color: Colors.WHITE,
  },
});
