import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';

export default function WelcomeScreen({ onFinish }) {
  const { user } = useAuth();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={60} color={Colors.WHITE} />
        </View>
        <Text style={styles.title}>Welcome to PawPrint!</Text>
        <Text style={styles.subtitle}>
          Hey {user?.displayName || 'there'}, your account is all set up.
        </Text>
        <Text style={styles.description}>
          Start tracking your furry friend's walks, meals, health, and memories all in one place.
        </Text>
        <View style={styles.pawRow}>
          <Ionicons name="paw" size={20} color={Colors.PRIMARY + '60'} />
          <Ionicons name="paw" size={28} color={Colors.PRIMARY + '80'} />
          <Ionicons name="paw" size={20} color={Colors.PRIMARY + '60'} />
        </View>
      </Animated.View>
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
    paddingHorizontal: 36,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.SUCCESS,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: Colors.SUCCESS,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  pawRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
