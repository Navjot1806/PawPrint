import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';

export default function AccordionSection({ title, icon, children, defaultOpen = false, onAdd }) {
  const [open, setOpen] = useState(defaultOpen);
  const animHeight = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  const toggle = () => {
    Animated.timing(animHeight, {
      toValue: open ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setOpen(!open);
  };

  const rotation = animHeight.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggle} activeOpacity={0.7}>
        <View style={styles.headerLeft}>
          {icon && <Ionicons name={icon} size={20} color={Colors.PRIMARY} style={styles.icon} />}
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.headerRight}>
          {onAdd && (
            <TouchableOpacity
              onPress={(e) => { e.stopPropagation?.(); onAdd(); }}
              style={styles.addBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="add-circle-outline" size={22} color={Colors.PRIMARY} />
            </TouchableOpacity>
          )}
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Ionicons name="chevron-down" size={20} color={Colors.TEXT_LIGHT} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {open && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addBtn: {
    padding: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
