import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';

export default function SnapshotCard({ icon, iconColor, title, value, subtitle, children }) {
  return (
    <View style={styles.card}>
      {icon && (
        <View style={[styles.iconBadge, { backgroundColor: (iconColor || Colors.PRIMARY) + '20' }]}>
          <Ionicons name={icon} size={22} color={iconColor || Colors.PRIMARY} />
        </View>
      )}
      {children || (
        <>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 16,
    marginRight: 14,
    width: SCREEN_WIDTH * 0.42,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 12,
    color: Colors.TEXT_SECONDARY,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.TEXT_LIGHT,
    marginTop: 4,
  },
});
