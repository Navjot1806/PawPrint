import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';

export default function VerifyEmailScreen() {
  const { user, resendVerification, reloadUser, logout } = useAuth();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer for resend button
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Auto-check verification every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      reloadUser();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerification();
      setCooldown(60);
      Alert.alert('Email Sent', 'A new verification link has been sent to your email.');
    } catch {
      Alert.alert('Error', 'Failed to send verification email. Please try again later.');
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    await reloadUser();
    setChecking(false);
    if (!user?.emailVerified) {
      Alert.alert('Not Verified Yet', 'Please check your email and click the verification link, then try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Orange circle with mail icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="mail-outline" size={56} color={Colors.WHITE} />
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification link to
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.description}>
          Please check your inbox and tap the link to verify your account. Check your spam folder if you don't see it.
        </Text>

        {/* Check Verification Button */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleCheckVerification}
          disabled={checking}
        >
          {checking ? (
            <ActivityIndicator color={Colors.WHITE} />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color={Colors.WHITE} />
              <Text style={styles.primaryBtnText}>I've Verified My Email</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Resend Button */}
        <TouchableOpacity
          style={[styles.secondaryBtn, (resending || cooldown > 0) && styles.btnDisabled]}
          onPress={handleResend}
          disabled={resending || cooldown > 0}
        >
          {resending ? (
            <ActivityIndicator color={Colors.PRIMARY} />
          ) : (
            <Text style={styles.secondaryBtnText}>
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Sign out link */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color={Colors.TEXT_SECONDARY} />
          <Text style={styles.logoutText}>Sign in with a different account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
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
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginTop: 4,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: Colors.TEXT_LIGHT,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 36,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 28,
    width: '100%',
    gap: 8,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.WHITE,
  },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: '100%',
    marginTop: 14,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    gap: 6,
  },
  logoutText: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
    fontWeight: '500',
  },
});
