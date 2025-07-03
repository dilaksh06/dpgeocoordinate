import {
    Camera,
    LocationManager,
    MapView,
    MapViewRef,
    UserLocation,
    UserTrackingMode,
    type Location,
} from "@maplibre/maplibre-react-native";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export function LiveLocation() {
    const mapRef = useRef<MapViewRef>(null);
    const [location, setLocation] = useState<Location | null>(null);

    useEffect(() => {
        // Start location updates with 0 displacement to receive all changes
        LocationManager.start(0);

        const handleLocationUpdate = (loc: Location) => {
            console.log("📍 Location Update:", {
                lat: loc.coords.latitude,
                lng: loc.coords.longitude,
                speed: loc.coords.speed,
                accuracy: loc.coords.accuracy,
                timestamp: new Date(loc.timestamp ?? Date.now()).toLocaleString(),
            });
            setLocation(loc);
        };

        // Add listener once
        LocationManager.addListener(handleLocationUpdate);

        return () => {
            // Clean up on unmount
            LocationManager.removeListener(handleLocationUpdate);
            LocationManager.stop();
        };
    }, []);

    return (
        <View style={styles.container}>
            <MapView ref={mapRef} style={styles.map}>
                <Camera
                    pitch={0}
                    zoomLevel={14}
                    followUserLocation={true}
                    animationDuration={6000}
                    followUserMode={UserTrackingMode.FollowWithCourse}
                    animationMode="easeTo"
                    followPitch={0}
                    followHeading={0}
                    followZoomLevel={17}


                />
                <UserLocation
                    animated
                    visible={true}
                    showsUserHeadingIndicator={true}
                    renderMode={'native'}
                    androidRenderMode={'gps'}

                    minDisplacement={1}
                    androidPreferredFramesPerSecond={30}
                />
            </MapView>

            {location && (
                <View style={styles.coordinateBox}>
                    <Text style={styles.coordText}>
                        Latitude: {location.coords.latitude.toFixed(6)}
                    </Text>
                    <Text style={styles.coordText}>
                        Longitude: {location.coords.longitude.toFixed(6)}
                    </Text>
                    <Text style={styles.coordText}>
                        Speed: {location.coords.speed ?? "N/A"} m/s
                    </Text>
                    <Text style={styles.coordText}>
                        Accuracy: {location.coords.accuracy ?? "N/A"} m
                    </Text>
                    <Text style={styles.coordText}>
                        Time: {new Date(location.timestamp ?? Date.now()).toLocaleTimeString()}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    coordinateBox: {
        position: "absolute",
        bottom: 30,
        left: 20,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 10,
        borderRadius: 8,
    },
    coordText: {
        color: "white",
        fontSize: 14,
    },
});
