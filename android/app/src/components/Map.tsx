// src/components/Map.tsx

import {
    Camera,
    type Location,
    MapView,
    UserLocation,
} from "@maplibre/maplibre-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export const Map = () => {
    const [location, setLocation] = useState<Location>();

    return (
        <View style={styles.container}>
            <MapView style={StyleSheet.absoluteFillObject}>
                <UserLocation onUpdate={(newLocation) => setLocation(newLocation)} />
                <Camera followUserLocation followZoomLevel={16} />
            </MapView>

            {location && (
                <View style={styles.bubble}>
                    <Text style={styles.text}>Timestamp: {location.timestamp}</Text>
                    <Text style={styles.text}>Longitude: {location.coords.longitude}</Text>
                    <Text style={styles.text}>Latitude: {location.coords.latitude}</Text>
                    <Text style={styles.text}>Altitude: {location.coords.altitude}</Text>
                    <Text style={styles.text}>Heading: {location.coords.heading}</Text>
                    <Text style={styles.text}>Accuracy: {location.coords.accuracy}</Text>
                    <Text style={styles.text}>Speed: {location.coords.speed}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bubble: {
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: 12,
        borderRadius: 10,
    },
    text: {
        color: "#fff",
        fontSize: 14,
        marginBottom: 2,
    },
});
