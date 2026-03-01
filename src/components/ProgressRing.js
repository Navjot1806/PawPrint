import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Colors from '../theme/colors';

export default function ProgressRing({
  size = 100,
  strokeWidth = 8,
  progress = 0.6,
  color = Colors.PRIMARY,
  label,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.BORDER}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.labelWrap}>
        <Text style={styles.percent}>{Math.round(progress * 100)}%</Text>
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  percent: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  label: {
    fontSize: 10,
    color: Colors.TEXT_SECONDARY,
    marginTop: 2,
  },
});
