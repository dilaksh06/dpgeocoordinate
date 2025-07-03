import { Camera, MapView, UserLocation } from "@maplibre/maplibre-react-native";
import { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

enum Alignment {
    Top = "TOP",
    Center = "CENTER",
    Bottom = "BOTTOM",
}

// Define how much padding is applied for each alignment
const INSETS: Record<Alignment, number[] | number> = {
    [Alignment.Top]: [0, 0, 300, 0],     // Top alignment
    [Alignment.Center]: 0,              // Centered (default)
    [Alignment.Bottom]: [300, 0, 0, 0], // Bottom alignment
};

export function MapAlign() {
    const [alignment, setAlignment] = useState<Alignment>(Alignment.Center);

    return (
        <View style={styles.container}>
            <View style={styles.optionContainer}>
                {Object.values(Alignment).map((value) => (
                    <Pressable
                        key={value}
                        style={[
                            styles.optionButton,
                            alignment === value && styles.selectedOption,
                        ]}
                        onPress={() => setAlignment(value)}
                    >
                        <Text style={styles.optionText}>{value}</Text>
                    </Pressable>
                ))}
            </View>

            <MapView style={StyleSheet.absoluteFillObject} contentInset={INSETS[alignment]}>
                <Camera followUserLocation followZoomLevel={16} />
                <UserLocation />
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
