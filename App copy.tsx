import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';

function App(): React.JSX.Element {
  const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);

  // Request location permission for Android
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          setError('Location permission denied permanently. Please enable it from settings.');
          Alert.alert(
            'Permission Required',
            'Location permission was denied permanently. Please enable it from the app settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ],
            { cancelable: false }
          );
        } else {
          setError('Location permission denied');
        }
        return false;
      } catch (err) {
        setError('Permission error: ' + (err as Error).message);
        return false;
      }
    }
    return true;
  };

  // Start watching live location
  const startWatchingLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
    }

    watchId.current = Geolocation.watchPosition(
      (position: GeoPosition) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
      },
      (error) => {
        setError(error.message);
        setLocation({ latitude: null, longitude: null });
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 3000, // Android only: Milliseconds between updates
        fastestInterval: 3000, // Android only
        showsBackgroundLocationIndicator: true, // iOS
        forceRequestLocation: true,
        useSignificantChanges: false,
      }
    );
  };

  // Stop watching location
  const stopWatchingLocation = () => {
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  };

  useEffect(() => {
    startWatchingLocation();

    // Cleanup on unmount
    return () => {
      stopWatchingLocation();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Location</Text>
      {location.latitude && location.longitude ? (
        <Text style={styles.location}>
          Latitude: {location.latitude.toFixed(6)}{'\n'}
          Longitude: {location.longitude.toFixed(6)}
        </Text>
      ) : (
        <Text style={styles.error}>{error || 'Fetching location...'}</Text>
      )}
      <Button title="Refresh Now" onPress={startWatchingLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  location: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default App;
