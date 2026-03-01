import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { formatDate, formatDistance, formatTime } from '../utils/helpers';

const { width } = Dimensions.get('window');

export default function MemoryCard({ memory, onDelete }) {
  const [liked, setLiked] = useState(false);

  const handleDoubleTap = (() => {
    let lastTap = 0;
    return () => {
      const now = Date.now();
      if (now - lastTap < 300) {
        setLiked(!liked);
      }
      lastTap = now;
    };
  })();

  const handleDelete = () => {
    Alert.alert('Delete Memory', 'Remove this memory?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete?.(memory) },
    ]);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.95}
      onPress={handleDoubleTap}
    >
      {memory.photoUrl ? (
        <Image source={{ uri: memory.photoUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Ionicons name="image-outline" size={48} color={Colors.TEXT_LIGHT} />
        </View>
      )}
      <View style={styles.info}>
        <View style={styles.infoLeft}>
          <Text style={styles.date}>{formatDate(memory.date)}</Text>
          {memory.caption && (
            <Text style={styles.caption} numberOfLines={2}>
              {memory.caption}
            </Text>
          )}
          {memory.walkDistance != null && (
            <View style={styles.walkInfo}>
              <View style={styles.walkStat}>
                <Ionicons name="footsteps-outline" size={14} color={Colors.SECONDARY} />
                <Text style={styles.walkStatText}>{formatDistance(memory.walkDistance)}</Text>
              </View>
              {memory.walkDuration != null && (
                <View style={styles.walkStat}>
                  <Ionicons name="time-outline" size={14} color={Colors.SECONDARY} />
                  <Text style={styles.walkStatText}>{formatTime(memory.walkDuration)}</Text>
                </View>
              )}
              {memory.walkPace && (
                <View style={styles.walkStat}>
                  <Ionicons name="speedometer-outline" size={14} color={Colors.SECONDARY} />
                  <Text style={styles.walkStatText}>{memory.walkPace}</Text>
                </View>
              )}
            </View>
          )}
          {memory.activityType && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{memory.activityType}</Text>
            </View>
          )}
        </View>
        <View style={styles.actionBtns}>
          <TouchableOpacity onPress={() => setLiked(!liked)} style={styles.actionBtn}>
            <Ionicons
              name={liked ? 'paw' : 'paw-outline'}
              size={22}
              color={liked ? Colors.PRIMARY : Colors.TEXT_LIGHT}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}>
            <Ionicons name="trash-outline" size={20} color={Colors.TEXT_LIGHT} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: width * 0.65,
    backgroundColor: Colors.BACKGROUND,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'flex-start',
  },
  infoLeft: {
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: Colors.TEXT_SECONDARY,
    marginBottom: 4,
  },
  caption: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    lineHeight: 20,
  },
  tag: {
    backgroundColor: Colors.PRIMARY + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.PRIMARY_DARK,
  },
  actionBtns: {
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    padding: 4,
  },
  walkInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
    backgroundColor: Colors.SECONDARY + '15',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  walkStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  walkStatText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.TEXT_SECONDARY,
  },
});
