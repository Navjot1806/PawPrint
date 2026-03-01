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

const TERMS = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By downloading, installing, or using PawPrint, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app.',
  },
  {
    title: '2. User Accounts',
    content:
      'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information when creating your account and keep it up to date.',
  },
  {
    title: '3. User Content',
    content:
      'You retain ownership of all content you upload to PawPrint, including photos, pet information, and health records. By uploading content, you grant PawPrint a license to store and display it within the app for your personal use.',
  },
  {
    title: '4. Acceptable Use',
    content:
      'You agree to use PawPrint only for its intended purpose of pet care tracking. You may not use the app for any illegal or unauthorized purpose, or attempt to interfere with the app\'s functionality.',
  },
  {
    title: '5. Health Information Disclaimer',
    content:
      'PawPrint is a tracking tool and does not provide veterinary medical advice. Information stored in the app should not replace professional veterinary consultation. Always consult a qualified veterinarian for your pet\'s health concerns.',
  },
  {
    title: '6. Data & Privacy',
    content:
      'Your use of PawPrint is also governed by our Privacy Policy. We collect and process your data as described in the Privacy Policy to provide and improve our services.',
  },
  {
    title: '7. Service Availability',
    content:
      'We strive to keep PawPrint available at all times, but we do not guarantee uninterrupted access. We may modify, suspend, or discontinue features with reasonable notice.',
  },
  {
    title: '8. Limitation of Liability',
    content:
      'PawPrint is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the app, including loss of data or inaccurate health tracking.',
  },
  {
    title: '9. Changes to Terms',
    content:
      'We may update these terms from time to time. Continued use of PawPrint after changes constitutes acceptance of the new terms. We will notify users of significant changes.',
  },
  {
    title: '10. Contact',
    content:
      'For questions about these Terms of Service, please contact us at support@pawprint.app.',
  },
];

export default function TermsOfServiceScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <Ionicons name="document-text" size={32} color={Colors.PRIMARY} />
          <Text style={styles.introTitle}>Terms of Service</Text>
          <Text style={styles.introText}>
            Please read these terms carefully before using PawPrint.
          </Text>
          <Text style={styles.lastUpdated}>Effective: February 2026</Text>
        </View>

        {TERMS.map((term, i) => (
          <View key={i} style={styles.termCard}>
            <Text style={styles.termTitle}>{term.title}</Text>
            <Text style={styles.termContent}>{term.content}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          By using PawPrint, you acknowledge that you have read and understood these Terms of Service.
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
  termCard: {
    backgroundColor: Colors.WHITE, borderRadius: 14, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  termTitle: { fontSize: 15, fontWeight: '700', color: Colors.TEXT_PRIMARY, marginBottom: 8 },
  termContent: { fontSize: 14, color: Colors.TEXT_SECONDARY, lineHeight: 20 },
  footer: {
    fontSize: 13, color: Colors.TEXT_LIGHT, textAlign: 'center',
    marginTop: 12, marginBottom: 20, lineHeight: 20, paddingHorizontal: 20,
  },
});
