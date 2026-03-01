import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';

const TAB_ICONS = {
  Home: { active: 'home', inactive: 'home-outline' },
  Health: { active: 'medkit', inactive: 'medkit-outline' },
  Activity: { active: 'paw', inactive: 'paw-outline' },
  Memories: { active: 'images', inactive: 'images-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

export default function TabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isCenter = route.name === 'Activity';
        const icons = TAB_ICONS[route.name];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (isCenter) {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.centerBtn}
              activeOpacity={0.8}
            >
              <View style={[styles.centerCircle, isFocused && styles.centerActive]}>
                <Ionicons name="paw" size={28} color={Colors.WHITE} />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFocused ? icons.active : icons.inactive}
              size={24}
              color={isFocused ? Colors.PRIMARY : Colors.TEXT_LIGHT}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  centerBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
  },
  centerCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  centerActive: {
    backgroundColor: Colors.PRIMARY_DARK,
  },
});
