import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';

const { width, height } = Dimensions.get('window');

function BackgroundPaw({ size, top, left, right, bottom, rotation, opacity }) {
  const style = {
    position: 'absolute',
    top,
    left,
    right,
    bottom,
    opacity: opacity || 0.15,
    transform: [{ rotate: rotation || '0deg' }],
  };
  return (
    <View style={style}>
      <Ionicons name="paw" size={size} color={Colors.WHITE} />
    </View>
  );
}

export default function SplashScreen({ onFinish }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const bgPawOpacity = useRef(new Animated.Value(0)).current;
  const boneY = useRef(new Animated.Value(20)).current;
  const boneOpacity = useRef(new Animated.Value(0)).current;
  const sparkleOpacity = useRef(new Animated.Value(0)).current;
  const sparkleScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Main logo animation
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Background paws fade in
    Animated.timing(bgPawOpacity, {
      toValue: 1,
      duration: 1200,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // Bone animation
    Animated.parallel([
      Animated.timing(boneOpacity, {
        toValue: 1,
        duration: 600,
        delay: 800,
        useNativeDriver: true,
      }),
      Animated.spring(boneY, {
        toValue: 0,
        friction: 5,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Sparkle animation
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(sparkleOpacity, {
            toValue: 1,
            duration: 600,
            delay: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleScale, {
            toValue: 1,
            duration: 600,
            delay: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(sparkleOpacity, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleScale, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    const timer = setTimeout(() => onFinish(), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background paw prints */}
      <Animated.View style={{ opacity: bgPawOpacity }}>
        <BackgroundPaw size={80} top={height * 0.08} right={-10} rotation="-20deg" opacity={0.12} />
        <BackgroundPaw size={60} top={height * 0.05} right={60} rotation="-30deg" opacity={0.1} />
        <BackgroundPaw size={90} top={height * 0.18} right={30} rotation="-15deg" opacity={0.08} />
        <BackgroundPaw size={70} bottom={height * 0.25} left={-15} rotation="25deg" opacity={0.12} />
        <BackgroundPaw size={55} bottom={height * 0.35} left={30} rotation="15deg" opacity={0.1} />
        <BackgroundPaw size={85} bottom={height * 0.18} left={10} rotation="30deg" opacity={0.08} />
      </Animated.View>

      {/* Main content */}
      <Animated.View style={[styles.content, { opacity, transform: [{ scale }] }]}>
        <View style={styles.iconWrap}>
          <Ionicons name="paw" size={90} color={Colors.WHITE} />
          <View style={styles.heartContainer}>
            <Ionicons name="heart" size={22} color={Colors.PRIMARY} />
          </View>
        </View>
        <Text style={styles.title}>PawPrint</Text>
      </Animated.View>

      {/* Bone icon at bottom */}
      <Animated.View
        style={[
          styles.boneContainer,
          { opacity: boneOpacity, transform: [{ translateY: boneY }] },
        ]}
      >
        <MaterialCommunityIcons name="bone" size={22} color={Colors.WHITE} />
      </Animated.View>

      {/* Sparkle decorations */}
      <Animated.View
        style={[
          styles.sparkleTopRight,
          { opacity: sparkleOpacity, transform: [{ scale: sparkleScale }] },
        ]}
      >
        <MaterialCommunityIcons name="star-four-points" size={16} color="rgba(255,255,255,0.6)" />
      </Animated.View>
      <Animated.View
        style={[
          styles.sparkleBottomRight,
          { opacity: sparkleOpacity, transform: [{ scale: sparkleScale }] },
        ]}
      >
        <MaterialCommunityIcons name="star-four-points" size={14} color="rgba(255,255,255,0.5)" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartContainer: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.WHITE,
    marginTop: 16,
    letterSpacing: 1,
  },
  boneContainer: {
    position: 'absolute',
    bottom: height * 0.08,
    alignSelf: 'center',
  },
  sparkleTopRight: {
    position: 'absolute',
    top: height * 0.12,
    right: width * 0.08,
  },
  sparkleBottomRight: {
    position: 'absolute',
    bottom: height * 0.06,
    right: width * 0.1,
  },
});
