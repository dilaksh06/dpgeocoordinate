import {
    Camera,
    LocationManager,
    MapView,
    UserLocation,
    UserTrackingMode,
    type Location,
} from "@maplibre/maplibre-react-native";
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MapNavsProps {
    // Optional props for customization
    onLocationUpdate?: (location: Location) => void;
    trackingMode?: UserTrackingMode;
    minDisplacement?: number;
}

const MapNavs: React.FC<MapNavsProps> = ({
    onLocationUpdate,
    trackingMode = UserTrackingMode.Follow,
    minDisplacement = 5, // 5 meters minimum displacement
}) => {
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [locationHistory, setLocationHistory] = useState<Location[]>([]);
    const mapRef = useRef<MapView>(null);
    const cameraRef = useRef<Camera>(null);

    useEffect(() => {
        // Set minimum displacement for location updates
        LocationManager.setMinDisplacement(minDisplacement);

        // Get last known location on component mount
        const getInitialLocation = async () => {
            try {
                const lastKnown = await LocationManager.getLastKnownLocation();
                if (lastKnown) {
                    setCurrentLocation(lastKnown);
                    onLocationUpdate?.(lastKnown);
                }
            } catch (error) {
                console.log('Error getting last known location:', error);
            }
        };

        getInitialLocation();

        return () => {
            // Cleanup listeners when component unmounts
            LocationManager.removeAllListeners();
        };
    }, [minDisplacement, onLocationUpdate]);

    const handleLocationUpdate = (location: Location) => {
        console.log('Location updated:', {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            speed: location.coords.speed,
            heading: location.coords.heading,
            course: location.coords.course,
            altitude: location.coords.altitude,
            timestamp: location.timestamp,
        });

        setCurrentLocation(location);

        // Add to location history (keep last 100 locations)
        setLocationHistory(prev => {
            const newHistory = [...prev, location];
            return newHistory.slice(-100);
        });

        // Call parent callback if provided
        onLocationUpdate?.(location);

        // Optionally center map on new location
        if (cameraRef.current && trackingMode === UserTrackingMode.Follow) {
            cameraRef.current.setCamera({
                centerCoordinate: [location.coords.longitude, location.coords.latitude],
                zoomLevel: 16,
                animationDuration: 1000,
            });
        }
    };

    const startTracking = () => {
        try {
            LocationManager.addListener(handleLocationUpdate);
            setIsTracking(true);
            console.log('Started location tracking');
        } catch (error) {
            console.error('Error starting location tracking:', error);
            Alert.alert('Error', 'Failed to start location tracking');
        }
    };

    const stopTracking = () => {
        try {
            LocationManager.removeListener(handleLocationUpdate);
            setIsTracking(false);
            console.log('Stopped location tracking');
        } catch (error) {
            console.error('Error stopping location tracking:', error);
        }
    };

    const clearLocationHistory = () => {
        setLocationHistory([]);
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                styleURL="https://demotiles.maplibre.org/style.json" // Replace with your map style
            >
                <Camera
                    ref={cameraRef}
                    zoomLevel={14}
                    centerCoordinate={
                        currentLocation
                            ? [currentLocation.coords.longitude, currentLocation.coords.latitude]
                            : [-74.006, 40.7128] // Default to NYC if no location
                    }
                />

                <UserLocation
                    visible={true}
                    showsUserHeadingIndicator={true}
                    minDisplacement={minDisplacement}
                />
            </MapView>

            {/* Location Info Overlay */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Navigation Info</Text>

                {currentLocation && (
                    <View style={styles.locationInfo}>
                        <Text style={styles.infoText}>
                            Lat: {currentLocation.coords.latitude.toFixed(6)}
                        </Text>
                        <Text style={styles.infoText}>
                            Lng: {currentLocation.coords.longitude.toFixed(6)}
                        </Text>
                        {currentLocation.coords.accuracy && (
                            <Text style={styles.infoText}>
                                Accuracy: {currentLocation.coords.accuracy.toFixed(1)}m
                            </Text>
                        )}
                        {currentLocation.coords.speed && (
                            <Text style={styles.infoText}>
                                Speed: {(currentLocation.coords.speed * 3.6).toFixed(1)} km/h
                            </Text>
                        )}
                        {currentLocation.coords.heading && (
                            <Text style={styles.infoText}>
                                Heading: {currentLocation.coords.heading.toFixed(1)}°
                            </Text>
                        )}
                        {currentLocation.coords.course && (
                            <Text style={styles.infoText}>
                                Course: {currentLocation.coords.course.toFixed(1)}°
                            </Text>
                        )}
                        <Text style={styles.infoText}>
                            History: {locationHistory.length} points
                        </Text>
                    </View>
                )}
            </View>

            {/* Control Buttons */}
            <View style={styles.controlsContainer}>
                <TouchableOpacity
                    style={[styles.button, isTracking && styles.buttonActive]}
                    onPress={isTracking ? stopTracking : startTracking}
                >
                    <Text style={styles.buttonText}>
                        {isTracking ? 'Stop Tracking' : 'Start Tracking'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={clearLocationHistory}
                >
                    <Text style={styles.buttonText}>Clear History</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    infoContainer: {
        position: 'absolute',
        top: 50,
        left: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 8,
        padding: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    locationInfo: {
        gap: 4,
    },
    infoText: {
        fontSize: 12,
        color: '#666',
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonActive: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default MapNavs;