import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapNavs from './MapNavs'; // Make sure MapNavs is in the correct paths

interface MapDetailsProps {
    hasPermission: boolean;
}



const MapDetails: React.FC<MapDetailsProps> = ({ hasPermission }) => {
    useEffect(() => {
        if (__DEV__) {
            console.log("MapDetails: hasPermission =", hasPermission);
        }
    }, [hasPermission]);

    return (
        <View style={styles.container}>
            {hasPermission ? (
                <MapNavs />
            ) : (
                <View style={styles.messageBox}>
                    <Text style={styles.permissionText}>
                        Location permission is required to show the map.
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    permissionText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#444',
    },
});

export default MapDetails;
