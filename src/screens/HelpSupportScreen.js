import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';

const FAQS = [
  {
    question: 'How do I add a new pet?',
    answer: 'Go to the Profile tab and tap "Edit" or "+ Set Up" under Pet Details. Fill in your dog\'s information and tap Save.',
  },
  {
    question: 'How do I track a walk?',
    answer: 'Navigate to the Activity tab and tap the "Start Walk" button. The app will track your route, distance, and duration using GPS.',
  },
  {
    question: 'How do I add health records?',
    answer: 'Go to the Health tab and select the Records, Meds, or Vets section. Tap the + button to add vaccinations, medications, or vet contacts.',
  },
  {
    question: 'How do I delete a memory?',
    answer: 'In the Memories tab, long-press on any memory card. A confirmation dialog will appear to delete it.',
  },
  {
    question: 'Can I add multiple care team members?',
    answer: 'Yes! Go to the Profile tab and tap "+ Add" in the Care Team section. You can add as many members as you need.',
  },
  {
    question: 'How do I reset my password?',
    answer: 'On the login screen, tap "Forgot Password?" and enter your email. You\'ll receive a reset link.',
  },
];

export default function HelpSupportScreen({ navigation }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFaq = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Contact Options */}
        <Text style={styles.sectionLabel}>Contact Us</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={[styles.contactRow, styles.rowBorder]}
            onPress={() => Linking.openURL('mailto:support@pawprint.app')}
          >
            <View style={[styles.iconWrap, { backgroundColor: Colors.PRIMARY + '15' }]}>
              <Ionicons name="mail-outline" size={20} color={Colors.PRIMARY} />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactDesc}>support@pawprint.app</Text>
            </View>
            <Ionicons name="open-outline" size={16} color={Colors.TEXT_LIGHT} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow}>
            <View style={[styles.iconWrap, { backgroundColor: Colors.SECONDARY + '20' }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.SECONDARY} />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>In-App Feedback</Text>
              <Text style={styles.contactDesc}>Send us your thoughts</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.TEXT_LIGHT} />
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <Text style={styles.sectionLabel}>Frequently Asked Questions</Text>
        <View style={styles.card}>
          {FAQS.map((faq, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.faqRow, i < FAQS.length - 1 && styles.rowBorder]}
              onPress={() => toggleFaq(i)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name={expandedIndex === i ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={Colors.TEXT_LIGHT}
                />
              </View>
              {expandedIndex === i && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.infoCard}>
          <Ionicons name="paw" size={28} color={Colors.PRIMARY} />
          <Text style={styles.infoTitle}>PawPrint v1.0.0</Text>
          <Text style={styles.infoText}>Made with love for pet parents</Text>
        </View>
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
  sectionLabel: {
    fontSize: 13, fontWeight: '600', color: Colors.TEXT_SECONDARY,
    marginTop: 20, marginBottom: 8, marginLeft: 4, textTransform: 'uppercase',
  },
  card: {
    backgroundColor: Colors.WHITE, borderRadius: 14, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  contactRow: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.BACKGROUND },
  iconWrap: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  contactText: { flex: 1 },
  contactLabel: { fontSize: 15, fontWeight: '600', color: Colors.TEXT_PRIMARY },
  contactDesc: { fontSize: 12, color: Colors.TEXT_SECONDARY, marginTop: 2 },
  faqRow: { padding: 16 },
  faqHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  faqQuestion: { fontSize: 14, fontWeight: '600', color: Colors.TEXT_PRIMARY, flex: 1, marginRight: 8 },
  faqAnswer: { fontSize: 14, color: Colors.TEXT_SECONDARY, marginTop: 10, lineHeight: 20 },
  infoCard: {
    alignItems: 'center', padding: 24, marginTop: 24,
  },
  infoTitle: { fontSize: 16, fontWeight: '700', color: Colors.TEXT_PRIMARY, marginTop: 8 },
  infoText: { fontSize: 13, color: Colors.TEXT_LIGHT, marginTop: 4 },
});
