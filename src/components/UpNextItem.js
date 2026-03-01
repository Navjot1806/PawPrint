import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';

export default function UpNextItem({ title, time, dotColor, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconWrap, { backgroundColor: (dotColor || Colors.PRIMARY) + '20' }]}>
        <Ionicons name={icon || 'alarm-outline'} size={20} color={dotColor || Colors.PRIMARY} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {time && <Text style={styles.time}>{time}</Text>}
      </View>
      <Ionicons name="trash-outline" size={18} color={Colors.TEXT_LIGHT} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  time: {
    fontSize: 12,
    color: Colors.TEXT_SECONDARY,
    marginTop: 2,
  },
});
