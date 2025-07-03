import type { CameraRef } from "@maplibre/maplibre-react-native";
import {
    Camera,
    LocationManager,
    MapView,
    UserLocation,
    UserTrackingMode,
    type Location,
} from "@maplibre/maplibre-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface MapNavsProps {
    onLocationUpdate?: (location: Location) => void;
    trackingMode?: UserTrackingMode;
    minDisplacement?: number;
}

const MapNavs: React.FC<MapNavsProps> = ({
    onLocationUpdate,
    trackingMode = UserTrackingMode.Follow,
    minDisplacement = 0,
}) => {
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [locationHistory, setLocationHistory] = useState<Location[]>([]);
    const cameraRef = useRef<CameraRef>(null);

    const handleLocationUpdate = useCallback(
        (location: Location) => {
            console.log("📍 Location updated:", location);
            setCurrentLocation(location);
            setLocationHistory((prev) => [...prev.slice(-99), location]);

            onLocationUpdate?.(location);

            // Optionally follow user if trackingMode is enabled
            if (cameraRef.current && trackingMode === UserTrackingMode.Follow) {
                cameraRef.current.setCamera({
                    centerCoordinate: [
                        location.coords.longitude,
                        location.coords.latitude,
                    ],
                    zoomLevel: 16,
                    animationDuration: 1000,
                });
            }
        },
        [onLocationUpdate, trackingMode]
    );

    useEffect(() => {
        const startNativeLocationUpdates = async () => {
            try {
                // Configure minimum distance
                LocationManager.setMinDisplacement(minDisplacement);

                await new Promise((res) => setTimeout(res, 100)); // Delay to apply displacement
                LocationManager.start(); // Start native updates
                LocationManager.addListener(handleLocationUpdate); // Register callback

                const lastKnown = await LocationManager.getLastKnownLocation();
                if (lastKnown) {
                    setCurrentLocation(lastKnown);
                    onLocationUpdate?.(lastKnown);
                }
            } catch (err) {
                console.error("❌ Failed to start native location tracking:", err);
            }

            return () => {
                LocationManager.removeListener(handleLocationUpdate);
                LocationManager.stop();
            };
        };

        startNativeLocationUpdates();

        return () => {
            LocationManager.removeListener(handleLocationUpdate);
            LocationManager.stop();
        };
    }, [handleLocationUpdate, minDisplacement, onLocationUpdate]);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                onUserLocationUpdate={handleLocationUpdate}
                attributionEnabled={false}
                logoEnabled={false}
                compassEnabled={true}
            >
                <Camera
                    ref={cameraRef}
                    followUserLocation={true}
                    followUserMode={UserTrackingMode.FollowWithCourse}
                    animationDuration={3000}
                    animationMode="easeTo"
                    followZoomLevel={17}
                    followHeading={0}
                    followPitch={0}
                    zoomLevel={14}
                    pitch={0}
                />

                <UserLocation
                    visible={true}
                    showsUserHeadingIndicator={true}
                    animated={true}
                    minDisplacement={minDisplacement}
                    androidPreferredFramesPerSecond={30}
                    renderMode="native"
                    androidRenderMode="gps"
                    onUpdate={handleLocationUpdate}

                />
            </MapView>

            {currentLocation && (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>Navigation Info</Text>
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
                        {currentLocation.coords.speed != null && (
                            <Text style={styles.infoText}>
                                Speed: {(currentLocation.coords.speed * 3.6).toFixed(1)} km/h
                            </Text>
                        )}
                        {currentLocation.coords.heading != null && (
                            <Text style={styles.infoText}>
                                Heading: {currentLocation.coords.heading.toFixed(1)}°
                            </Text>
                        )}
                        {currentLocation.coords.course != null && (
                            <Text style={styles.infoText}>
                                Course: {currentLocation.coords.course.toFixed(1)}°
                            </Text>
                        )}
                        <Text style={styles.infoText}>
                            History: {locationHistory.length} points
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    infoContainer: {
        position: "absolute",
        top: 50,
        left: 10,
        right: 10,
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 8,
        padding: 12,
        elevation: 5,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    locationInfo: { gap: 4 },
    infoText: { fontSize: 12, color: "#666" },
});

export default MapNavs;
