import {
    Camera,
    LocationManager,
    MapView,
    UserLocation,
    UserTrackingMode,
    type Location,
} from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const DISPLACEMENT_OPTIONS = [0, 5, 10];

export function MapDis() {
    const [minDisplacement, setMinDisplacement] = useState(0);
    const [location, setLocation] = useState<Location | null>(null);

    useEffect(() => {
        LocationManager.start(minDisplacement);

        const handleUpdate = (loc: Location) => {
            setLocation(loc);
            console.log("📍 New Location:", {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                timestamp: loc.timestamp,
                speed: loc.coords.speed,
            });
        };

        LocationManager.addListener(handleUpdate);

        return () => {
            LocationManager.removeListener(handleUpdate);
            LocationManager.stop();
        };
    }, [minDisplacement]);

    return (
        <View style={styles.container}>
            {/* Displacement Buttons */}
            <View style={styles.optionContainer}>
                {DISPLACEMENT_OPTIONS.map((option) => (
                    <Pressable
                        key={option}
                        style={[
                            styles.optionButton,
                            minDisplacement === option && styles.selectedOption,
                        ]}
                        onPress={() => setMinDisplacement(option)}
                    >
                        <Text style={styles.optionText}>{option} Meter</Text>
                    </Pressable>
                ))}
            </View>

            {/* Map Display */}
            <MapView style={StyleSheet.absoluteFillObject}>
                <Camera
                    followUserLocation
                    followUserMode={UserTrackingMode.FollowWithHeading}
                    followZoomLevel={16}
                />
                <UserLocation
                    animated
                    renderMode="native"
                    minDisplacement={minDisplacement} />
            </MapView>

            {/* Live Coordinates */}
            {location && (
                <View style={styles.locationBubble}>
                    <Text style={styles.coordText}>Latitude: {location.coords.latitude}</Text>
                    <Text style={styles.coordText}>Longitude: {location.coords.longitude}</Text>
                    <Text style={styles.coordText}>Speed: {location.coords.speed ?? "N/A"} m/s</Text>
                    <Text style={styles.coordText}>Accuracy: {location.coords.accuracy ?? "N/A"} m</Text>
                    <Text style={styles.coordText}>
                        Timestamp: {new Date(location.timestamp ?? Date.now()).toLocaleTimeString()}
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
    optionContainer: {
        position: "absolute",
        top: 10,
        left: 10,
        right: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        zIndex: 2,
        backgroundColor: "#fff",
        paddingVertical: 8,
        borderRadius: 8,
        elevation: 4,
    },
    optionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: "#eee",
        borderRadius: 6,
    },
    selectedOption: {
        backgroundColor: "#007aff",
    },
    optionText: {
        color: "#000",
        fontWeight: "bold",
    },
    locationBubble: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "#ffffffdd",
        padding: 10,
        borderRadius: 8,
        zIndex: 2,
    },
    coordText: {
        fontSize: 14,
        color: "#000",
        textAlign: "center",
    },
});
