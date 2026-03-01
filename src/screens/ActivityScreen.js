import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { formatTime, formatDistance, formatPace } from '../utils/helpers';
import { useData } from '../contexts/DataContext';

const { width } = Dimensions.get('window');

const DEFAULT_REGION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function ActivityScreen() {
  const { addWalk, addMemory } = useData();
  const [tracking, setTracking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const mapRef = useRef(null);
  const timerRef = useRef(null);
  const locationSub = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Location Permission Required',
            'Go to Settings and enable location access for this app to track walks.',
            [{ text: 'OK' }]
          );
          return;
        }
        setLocationPermission(true);
        setRegion(DEFAULT_REGION); // show map immediately while GPS resolves
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setCurrentLocation(coords);
        setRegion({
          ...coords,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      } catch (err) {
        // Location unavailable (e.g. simulator with no location set)
        setLocationPermission(true); // permission may be granted even if position fails
        setRegion(DEFAULT_REGION);
      }
    })();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (locationSub.current) locationSub.current.remove();
    };
  }, []);

  const startTracking = async () => {
    setTracking(true);
    setPaused(false);
    setSeconds(0);
    setRoute([]);
    setDistance(0);

    timerRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    try {
      locationSub.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 3000,
        },
        (loc) => {
          const newPoint = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setRoute((prev) => {
            if (prev.length > 0) {
              const last = prev[prev.length - 1];
              const d = getDistanceFromLatLon(
                last.latitude,
                last.longitude,
                newPoint.latitude,
                newPoint.longitude
              );
              setDistance((prevDist) => prevDist + d);
            }
            return [...prev, newPoint];
          });
          setCurrentLocation(newPoint);
          mapRef.current?.animateToRegion({
            ...newPoint,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        }
      );
    } catch (err) {
      // Timer still runs; GPS tracking silently unavailable (e.g. simulator)
    }
  };

  const pauseTracking = () => {
    setPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (locationSub.current) locationSub.current.remove();
  };

  const resumeTracking = async () => {
    setPaused(false);
    timerRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    try {
      locationSub.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 3000,
        },
        (loc) => {
          const newPoint = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setRoute((prev) => {
            if (prev.length > 0) {
              const last = prev[prev.length - 1];
              const d = getDistanceFromLatLon(
                last.latitude,
                last.longitude,
                newPoint.latitude,
                newPoint.longitude
              );
              setDistance((prevDist) => prevDist + d);
            }
            return [...prev, newPoint];
          });
          setCurrentLocation(newPoint);
        }
      );
    } catch (err) {
      // Timer still runs; GPS tracking silently unavailable
    }
  };

  const pickWalkPhoto = (source) =>
    new Promise(async (resolve) => {
      try {
        let result;
        if (source === 'camera') {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera access is needed to take a photo.');
            return resolve(null);
          }
          result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.3,
            base64: true,
            exif: false,
          });
        } else {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Photo library access is needed.');
            return resolve(null);
          }
          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.3,
            base64: true,
            exif: false,
          });
        }
        if (!result.canceled && result.assets[0]) {
          const asset = result.assets[0];
          const photoUri = asset.base64
            ? `data:image/jpeg;base64,${asset.base64}`
            : asset.uri;
          resolve(photoUri);
        } else {
          resolve(null);
        }
      } catch {
        resolve(null);
      }
    });

  const saveWalkWithPhoto = async (finalDistance, finalSeconds, photoUri) => {
    const walkDate = new Date().toISOString();
    try {
      await addWalk({
        duration: finalSeconds,
        distance: finalDistance,
        pace: formatPace(finalDistance, finalSeconds),
        date: walkDate,
      });
      await addMemory(
        {
          caption: `Walked ${formatDistance(finalDistance)} in ${formatTime(finalSeconds)}`,
          activityType: 'Walk',
          date: walkDate,
          walkDistance: finalDistance,
          walkDuration: finalSeconds,
          walkPace: formatPace(finalDistance, finalSeconds),
        },
        photoUri
      );
    } catch (err) {
      console.warn('Failed to save walk:', err);
      Alert.alert('Error', 'Failed to save walk. Please try again.');
    }
  };

  const stopTracking = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (locationSub.current) locationSub.current.remove();

    if (seconds > 0) {
      const finalDistance = distance;
      const finalSeconds = seconds;

      setTracking(false);
      setPaused(false);

      Alert.alert(
        'Walk Complete!',
        `Duration: ${formatTime(finalSeconds)}\nDistance: ${formatDistance(finalDistance)}\nPace: ${formatPace(finalDistance, finalSeconds)}`,
        [
          {
            text: 'Save Walk',
            onPress: () => {
              Alert.alert(
                'Add a Photo',
                'Capture a photo from your walk to save with this memory!',
                [
                  {
                    text: 'Take Photo',
                    onPress: async () => {
                      const photo = await pickWalkPhoto('camera');
                      await saveWalkWithPhoto(finalDistance, finalSeconds, photo);
                    },
                  },
                  {
                    text: 'Choose from Library',
                    onPress: async () => {
                      const photo = await pickWalkPhoto('library');
                      await saveWalkWithPhoto(finalDistance, finalSeconds, photo);
                    },
                  },
                  {
                    text: 'Skip',
                    style: 'cancel',
                    onPress: () => saveWalkWithPhoto(finalDistance, finalSeconds, null),
                  },
                ]
              );
            },
          },
          { text: 'Discard', style: 'destructive' },
        ]
      );
    } else {
      setTracking(false);
      setPaused(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Activity Tracker</Text>

      {/* Timer */}
      <View style={styles.timerWrap}>
        <Text style={styles.timer}>{formatTime(seconds)}</Text>
        {tracking && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{paused ? 'Paused' : 'Tracking'}</Text>
          </View>
        )}
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {region ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={region}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {route.length > 1 && (
              <Polyline
                coordinates={route}
                strokeWidth={4}
                strokeColor={Colors.PRIMARY}
              />
            )}
            {route.length > 0 && (
              <Marker coordinate={route[0]} title="Start">
                <View style={styles.startMarker}>
                  <Ionicons name="flag" size={16} color={Colors.WHITE} />
                </View>
              </Marker>
            )}
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={48} color={Colors.TEXT_LIGHT} />
            <Text style={styles.mapPlaceholderText}>Loading map...</Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatDistance(distance)}</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatPace(distance, seconds)}</Text>
          <Text style={styles.statLabel}>Pace</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatTime(seconds)}</Text>
          <Text style={styles.statLabel}>Time</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {!tracking ? (
          <TouchableOpacity style={styles.startBtn} onPress={startTracking}>
            <Ionicons name="play" size={28} color={Colors.WHITE} />
            <Text style={styles.startBtnText}>Start Walk</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.trackingControls}>
            {paused ? (
              <TouchableOpacity style={styles.resumeBtn} onPress={resumeTracking}>
                <Ionicons name="play" size={24} color={Colors.WHITE} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.pauseBtn} onPress={pauseTracking}>
                <Ionicons name="pause" size={24} color={Colors.TEXT_PRIMARY} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.stopBtn} onPress={stopTracking}>
              <Ionicons name="stop" size={24} color={Colors.WHITE} />
              <Text style={styles.stopBtnText}>Finish</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  timerWrap: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  timer: {
    fontSize: 48,
    fontWeight: '200',
    color: Colors.TEXT_PRIMARY,
    fontVariant: ['tabular-nums'],
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.SUCCESS,
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    color: Colors.SUCCESS,
    fontWeight: '600',
  },
  mapContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    height: width * 0.55,
    backgroundColor: Colors.WHITE,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: Colors.TEXT_LIGHT,
    marginTop: 8,
  },
  startMarker: {
    backgroundColor: Colors.SUCCESS,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.TEXT_SECONDARY,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.BORDER,
  },
  controls: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  startBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startBtnText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
  },
  trackingControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  pauseBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.BORDER,
  },
  resumeBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.SUCCESS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.WARNING,
    borderRadius: 28,
    height: 56,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtnText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
