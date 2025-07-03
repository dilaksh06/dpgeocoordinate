import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import { useEffect } from 'react';
import {
    Alert,
    Button,
    PermissionsAndroid,
    Platform,
    Text,
    View,
} from 'react-native';

const requestLocationPermissions = async () => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        ]);

        const allGranted = Object.values(granted).every(
            (status) => status === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
            Alert.alert('Permission required', 'Please allow all location permissions.');
        }
    }
};

const BackgroundTracker = () => {
    useEffect(() => {
        requestLocationPermissions();

        BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 50,
            distanceFilter: 50,
            notificationTitle: 'Location Tracking',
            notificationText: 'Enabled',
            debug: true,
            startOnBoot: true,
            stopOnTerminate: false,
            locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
            interval: 10000,
            fastestInterval: 5000,
            activitiesInterval: 10000,
            stopOnStillActivity: false,
        });

        BackgroundGeolocation.on('location', (location) => {
            console.log('[Location]', location);
            // Optional: send to server or save locally
        });

        BackgroundGeolocation.on('error', (error) => {
            console.warn('[ERROR]', error);
        });

        BackgroundGeolocation.on('start', () => {
            console.log('[STARTED]');
        });

        BackgroundGeolocation.on('stop', () => {
            console.log('[STOPPED]');
        });

        BackgroundGeolocation.on('authorization', (status) => {
            console.log('[AUTH STATUS]', status);
            if (status !== BackgroundGeolocation.AUTHORIZED) {
                Alert.alert('App needs location permission.');
            }
        });

        return () => {
            BackgroundGeolocation.removeAllListeners();
        };
    }, []);

    const startTracking = () => {
        BackgroundGeolocation.start(); // Will start background service
    };

    const stopTracking = () => {
        BackgroundGeolocation.stop(); // Will stop background service
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Background Location Tracking</Text>
            <Button title="Start Tracking" onPress={startTracking} />
            <View style={{ height: 10 }} />
            <Button title="Stop Tracking" onPress={stopTracking} />
        </View>
    );
};

export default BackgroundTracker;
