import {
    Camera,
    LocationManager,
    MapView,
    UserLocation,
} from "@maplibre/maplibre-react-native";
import { useEffect, useState } from "react";
import {
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const FPS_OPTIONS = [5, 10, 15];

export function MapFPS() {
    const [fps, setFps] = useState(FPS_OPTIONS[0]);

    useEffect(() => {
        LocationManager.start();

        return () => {
            LocationManager.stop();
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.optionContainer}>
                {FPS_OPTIONS.map((value) => (
                    <Pressable
                        key={value}
                        style={[
                            styles.optionButton,
                            fps === value && styles.selectedOption,
                        ]}
                        onPress={() => setFps(value)}
                    >
                        <Text style={styles.optionText}>{value} FPS</Text>
                    </Pressable>
                ))}
            </View>

            <MapView style={StyleSheet.absoluteFillObject}>
                <Camera followZoomLevel={16} followUserLocation />
                <UserLocation
                    animated
                    renderMode="native"
                    androidPreferredFramesPerSecond={Platform.OS === "android" ? fps : undefined}
                />
            </MapView>
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
        zIndex: 1,
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
});
