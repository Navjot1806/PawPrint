import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch {
      // error handled in context
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.sentContent}>
          <View style={styles.sentIconCircle}>
            <Ionicons name="mail-open-outline" size={52} color={Colors.WHITE} />
          </View>
          <Text style={styles.sentTitle}>Check Your Email</Text>
          <Text style={styles.sentSubtitle}>
            We've sent a password reset link to
          </Text>
          <Text style={styles.sentEmail}>{email}</Text>
          <Text style={styles.sentDescription}>
            Open the link in your email to set a new password. Check your spam folder if you don't see it.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back to Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resendLink}
            onPress={() => { setSent(false); }}
          >
            <Text style={styles.resendText}>Didn't receive it? Try again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.TEXT_PRIMARY} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Ionicons name="key-outline" size={48} color={Colors.PRIMARY} />
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email and we'll send you a link to reset your password.
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color={Colors.TEXT_LIGHT} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.TEXT_LIGHT}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.WHITE} />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 28,
  },
  backBtn: {
    marginTop: Platform.OS === 'ios' ? 56 : 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.TEXT_SECONDARY,
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
    minHeight: 48, paddingVertical: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.TEXT_PRIMARY,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    minHeight: 48, paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 17,
    fontWeight: '700',
  },
  // Sent success state
  sentContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  sentIconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  sentTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 10,
  },
  sentSubtitle: {
    fontSize: 15,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
  },
  sentEmail: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginTop: 4,
    marginBottom: 16,
  },
  sentDescription: {
    fontSize: 14,
    color: Colors.TEXT_LIGHT,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 36,
  },
  resendLink: {
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
});
