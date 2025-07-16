import Geo from 'dp-geo-coordinates';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  DeviceEventEmitter,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { insertLocation } from './android/app/src/lib/supabse'; // ✅ used for manual upload
const SUPABASE_ANON_KEY =
  '';

export default function App() {
  const [location, setLocation] = useState<any>(null);
  const latestLocation = useRef<any>(null);
  const [trackingType, setTrackingType] = useState<
    'none' | 'foreground' | 'background'
  >('none');

  useEffect(() => {
    // Request location permission on mount
    Geo.requestPermission().then((result) => {
      console.log('📱 Permission:', result);
    });

    // Setup listener for real-time location updates
    const subscription = DeviceEventEmitter.addListener(
      'locationUpdated',
      (loc) => {
        console.log('📡 Real-time Update:', loc);
        latestLocation.current = loc;
        setLocation(loc);
      }
    );

    // ✅ Set the API config for background upload
    Geo.setUploadConfig(
      'https://gpauttseecilvbnwylhs.supabase.co/rest/v1/locations',
      {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation',
      }
    );
    return () => {
      subscription.remove();
      Geo.stopWatching();
      Geo.stopBackgroundTracking();
    };
  }, []);

  const getLocation = async () => {
    try {
      const loc = await Geo.getCurrentLocation();
      console.log('📍 One-time Location:', loc);
      setLocation(loc);
      latestLocation.current = loc;
      setTrackingType('none');
    } catch (e) {
      console.warn('❌ Location Error:', e);
    }
  };

  const startForeground = () => {
    Geo.startWatching();
    setTrackingType('foreground');
    console.log('🛰️ Foreground tracking started');
  };

  const stopForeground = () => {
    Geo.stopWatching();
    setTrackingType('none');
    console.log('🛑 Foreground tracking stopped');
  };

  const startBackground = () => {
    Geo.startBackgroundTracking();
    setTrackingType('background');
    console.log('📦 Background tracking started');
  };

  const stopBackground = () => {
    Geo.stopBackgroundTracking();
    setTrackingType('none');
    console.log('🛑 Background tracking stopped');
  };

  // ✅ Manual upload (for testing only)
  const uploadToSupabase = async () => {
    const loc = latestLocation.current;

    if (!loc || !loc.latitude || !loc.longitude || !loc.source) {
      console.warn('⚠️ Missing location data');
      return;
    }

    const result = await insertLocation({
      latitude: loc.latitude,
      longitude: loc.longitude,
      accuracy: loc.accuracy ?? null,
      speed: loc.speed ?? null,
      heading: loc.heading ?? null,
      source: loc.source,
      timestamp: loc.timestamp
        ? new Date(loc.timestamp).toISOString()
        : new Date().toISOString(),
    });

    if (!result.success) {
      console.error('❌ Upload failed:', result.error);
    } else {
      console.log('✅ Upload successful!');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
        📍 Geo Tracker ({trackingType})
      </Text>

      <Button title="Get One-Time Location" onPress={getLocation} />
      <Button title="Start Foreground Tracking" onPress={startForeground} />
      <Button title="Stop Foreground Tracking" onPress={stopForeground} />
      <Button title="Start Background Tracking" onPress={startBackground} />
      <Button title="Stop Background Tracking" onPress={stopBackground} />

      {/* ✅ Optional: Manual upload test */}
      <Button title="Upload to Supabase" onPress={uploadToSupabase} />

      {location && (
        <View style={{ marginTop: 16 }}>
          <Text>🌍 Latitude: {location.latitude}</Text>
          <Text>🌍 Longitude: {location.longitude}</Text>
          <Text>🎯 Accuracy: {location.accuracy} m</Text>
          <Text>🚀 Speed: {location.speed} m/s</Text>
          <Text>🧭 Heading: {location.heading}°</Text>
          <Text>📡 Source: {location.source}</Text>
          <Text>
            ⏰ Time: {new Date(location.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
