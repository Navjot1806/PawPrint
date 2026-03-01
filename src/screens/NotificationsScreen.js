import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';

export default function NotificationsScreen({ navigation }) {
  const [walkReminders, setWalkReminders] = useState(true);
  const [feedingReminders, setFeedingReminders] = useState(true);
  const [medReminders, setMedReminders] = useState(true);
  const [vetAppointments, setVetAppointments] = useState(true);
  const [vaccinationAlerts, setVaccinationAlerts] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Daily Reminders</Text>
        <View style={styles.card}>
          <NotifRow
            icon="walk-outline"
            label="Walk Reminders"
            description="Get reminded to take your dog for a walk"
            value={walkReminders}
            onToggle={setWalkReminders}
          />
          <NotifRow
            icon="restaurant-outline"
            label="Feeding Reminders"
            description="Reminders for meal times"
            value={feedingReminders}
            onToggle={setFeedingReminders}
          />
          <NotifRow
            icon="medical-outline"
            label="Medication Reminders"
            description="Never miss a dose"
            value={medReminders}
            onToggle={setMedReminders}
            last
          />
        </View>

        <Text style={styles.sectionLabel}>Health Alerts</Text>
        <View style={styles.card}>
          <NotifRow
            icon="calendar-outline"
            label="Vet Appointments"
            description="Upcoming appointment reminders"
            value={vetAppointments}
            onToggle={setVetAppointments}
          />
          <NotifRow
            icon="shield-checkmark-outline"
            label="Vaccination Alerts"
            description="Alerts when vaccinations are due"
            value={vaccinationAlerts}
            onToggle={setVaccinationAlerts}
            last
          />
        </View>

        <Text style={styles.sectionLabel}>Reports</Text>
        <View style={styles.card}>
          <NotifRow
            icon="bar-chart-outline"
            label="Weekly Summary"
            description="Get a weekly report of your dog's activity"
            value={weeklyReport}
            onToggle={setWeeklyReport}
            last
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function NotifRow({ icon, label, description, value, onToggle, last }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <View style={styles.rowLeft}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={20} color={Colors.PRIMARY} />
        </View>
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>{label}</Text>
          <Text style={styles.rowDesc}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.BACKGROUND, true: Colors.PRIMARY + '60' }}
        thumbColor={value ? Colors.PRIMARY : '#ccc'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12,
  },
  backBtn: { width: 40 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.TEXT_PRIMARY },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 13, fontWeight: '600', color: Colors.TEXT_SECONDARY,
    marginTop: 20, marginBottom: 8, marginLeft: 4, textTransform: 'uppercase',
  },
  card: {
    backgroundColor: Colors.WHITE, borderRadius: 14, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.BACKGROUND },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  iconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.PRIMARY + '15', alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: '600', color: Colors.TEXT_PRIMARY },
  rowDesc: { fontSize: 12, color: Colors.TEXT_SECONDARY, marginTop: 2 },
});
