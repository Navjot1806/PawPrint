import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';

const SECTIONS = [
  {
    title: 'Data We Collect',
    icon: 'folder-outline',
    content:
      'PawPrint collects information you provide directly, such as your pet\'s name, breed, health records, photos, and activity data. We also collect basic account information like your email address.',
  },
  {
    title: 'How We Use Your Data',
    icon: 'analytics-outline',
    content:
      'Your data is used to provide and improve the PawPrint experience, including tracking your pet\'s health, activities, and memories. We do not sell your personal information to third parties.',
  },
  {
    title: 'Data Storage & Security',
    icon: 'lock-closed-outline',
    content:
      'Your data is securely stored using Firebase services with encryption in transit and at rest. We implement industry-standard security measures to protect your information.',
  },
  {
    title: 'Photo Storage',
    icon: 'images-outline',
    content:
      'Photos you upload are stored securely in the cloud. You can delete your photos at any time, and they will be permanently removed from our servers.',
  },
  {
    title: 'Third-Party Services',
    icon: 'globe-outline',
    content:
      'PawPrint uses Firebase (Google) for authentication and data storage, and Expo for app delivery. These services have their own privacy policies.',
  },
  {
    title: 'Your Rights',
    icon: 'person-outline',
    content:
      'You have the right to access, update, or delete your personal data at any time. You can delete your account and all associated data by contacting our support team.',
  },
];

export default function PrivacyScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <Ionicons name="shield-checkmark" size={32} color={Colors.PRIMARY} />
          <Text style={styles.introTitle}>Your Privacy Matters</Text>
          <Text style={styles.introText}>
            We are committed to protecting your personal information and being transparent about what we collect and how we use it.
          </Text>
          <Text style={styles.lastUpdated}>Last updated: February 2026</Text>
        </View>

        {SECTIONS.map((section, i) => (
          <View key={i} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconWrap}>
                <Ionicons name={section.icon} size={18} color={Colors.PRIMARY} />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          If you have questions about our privacy practices, please contact us at support@pawprint.app
        </Text>
      </ScrollView>
    </SafeAreaView>
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
  introCard: {
    backgroundColor: Colors.WHITE, borderRadius: 14, padding: 24,
    alignItems: 'center', marginTop: 8, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  introTitle: {
    fontSize: 18, fontWeight: '700', color: Colors.TEXT_PRIMARY, marginTop: 12,
  },
  introText: {
    fontSize: 14, color: Colors.TEXT_SECONDARY, textAlign: 'center',
    marginTop: 8, lineHeight: 20,
  },
  lastUpdated: {
    fontSize: 12, color: Colors.TEXT_LIGHT, marginTop: 12,
  },
  sectionCard: {
    backgroundColor: Colors.WHITE, borderRadius: 14, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iconWrap: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: Colors.PRIMARY + '15', alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.TEXT_PRIMARY },
  sectionContent: { fontSize: 14, color: Colors.TEXT_SECONDARY, lineHeight: 20 },
  footer: {
    fontSize: 13, color: Colors.TEXT_LIGHT, textAlign: 'center',
    marginTop: 12, marginBottom: 20, lineHeight: 20, paddingHorizontal: 20,
  },
});
