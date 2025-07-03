import Geo from '@dp/geo-coordinates'; // <-- Your local package
import React, { useEffect, useRef, useState } from 'react';
import { Button, DeviceEventEmitter, ScrollView, Text, View } from 'react-native';

export default function DpCoordTest() {
  const [location, setLocation] = useState<any>(null);
  const latestLocation = useRef<any>(null);
  const [trackingType, setTrackingType] = useState<'none' | 'foreground' | 'background'>('none');

  useEffect(() => {
    Geo.requestPermission().then(result => {
      console.log('📱 Permission:', result);
    });

    const subscription = DeviceEventEmitter.addListener('locationUpdated', loc => {
      console.log('📡 Real-time Update:', loc);
      latestLocation.current = loc;
      setLocation(loc);
    });

    return () => {
      subscription.remove();
      Geo.stopWatching();
      Geo.stopBackgroundTracking();
    };
  }, []);

  const getLocation = async () => {
    const loc = await Geo.getCurrentLocation();
    setLocation(loc);
    setTrackingType('none');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>📍 dpCoord Test ({trackingType})</Text>

      <Button title="One-Time Location" onPress={getLocation} />
      <Button title="Start Foreground Tracking" onPress={() => { Geo.startWatching(); setTrackingType('foreground'); }} />
      <Button title="Stop Foreground Tracking" onPress={() => { Geo.stopWatching(); setTrackingType('none'); }} />
      <Button title="Start Background Tracking" onPress={() => { Geo.startBackgroundTracking(); setTrackingType('background'); }} />
      <Button title="Stop Background Tracking" onPress={() => { Geo.stopBackgroundTracking(); setTrackingType('none'); }} />

      {location && (
        <View style={{ marginTop: 20 }}>
          <Text>🌍 Latitude: {location.latitude}</Text>
          <Text>🌍 Longitude: {location.longitude}</Text>
          <Text>🎯 Accuracy: {location.accuracy}</Text>
          <Text>🚀 Speed: {location.speed}</Text>
          <Text>🧭 Heading: {location.heading}</Text>
          <Text>📡 Source: {location.source}</Text>
          <Text>⏰ Time: {new Date(location.timestamp).toLocaleTimeString()}</Text>
        </View>
      )}
    </ScrollView>
  );
}
