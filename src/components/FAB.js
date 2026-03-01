import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';

const ACTIONS = [
  { key: 'walk', icon: 'walk-outline', label: 'Log Walk', color: Colors.SECONDARY },
  { key: 'photo', icon: 'camera-outline', label: 'Add Photo', color: Colors.PRIMARY },
  { key: 'reminder', icon: 'alarm-outline', label: 'Set Reminder', color: '#9B59B6' },
];

export default function FAB({ onAction }) {
  const [open, setOpen] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    Animated.spring(rotation, {
      toValue: open ? 0 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const handleAction = (key) => {
    toggle();
    onAction?.(key);
  };

  return (
    <>
      {open && (
        <Modal transparent visible animationType="fade">
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={toggle}
          >
            <View style={styles.menuWrap}>
              {ACTIONS.map((action, i) => (
                <TouchableOpacity
                  key={action.key}
                  style={styles.menuItem}
                  onPress={() => handleAction(action.key)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.menuLabel}>{action.label}</Text>
                  <View style={[styles.menuIcon, { backgroundColor: action.color }]}>
                    <Ionicons name={action.icon} size={22} color={Colors.WHITE} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
      <TouchableOpacity style={styles.fab} onPress={toggle} activeOpacity={0.85}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="add" size={30} color={Colors.WHITE} />
        </Animated.View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.13,
    right: SCREEN_WIDTH * 0.05,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: SCREEN_HEIGHT * 0.22,
    paddingRight: SCREEN_WIDTH * 0.05,
  },
  menuWrap: {
    alignItems: 'flex-end',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  menuLabel: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
