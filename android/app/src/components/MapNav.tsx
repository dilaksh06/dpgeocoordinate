import {
    Camera,
    MapView,
    SymbolLayer,
    UserLocation,
    UserLocationRenderMode,
    UserTrackingMode,
} from "@maplibre/maplibre-react-native";
import { useState } from "react";
import { Button } from "react-native";

import { sheet } from "../../src/styles/sheet";
import { OSM_RASTER_STYLE } from "../assets/constants/OSM_RASTER_STYLE";
import maplibreIcon from "../assets/images/maplibre.png";

export function MapNav() {
    const [navigationActive, setNavigationActive] = useState(false);

    return (
        <>
            <Button
                title={`Navigation is ${navigationActive ? "active" : "inactive"}`}
                onPress={() => setNavigationActive((prevState) => !prevState)}
            />

            <MapView
                style={sheet.matchParent}
                mapStyle={OSM_RASTER_STYLE}
                contentInset={navigationActive ? [200, 0, 0, 0] : undefined}
                pitchEnabled={navigationActive}
            >
                {navigationActive ? (
                    <UserLocation
                        renderMode={
                            navigationActive
                                ? UserLocationRenderMode.Normal
                                : UserLocationRenderMode.Native
                        }
                        showsUserHeadingIndicator
                    >
                        <SymbolLayer
                            id="navigation-icon"
                            style={{
                                iconImage: maplibreIcon,
                                iconPitchAlignment: "map",
                                iconAllowOverlap: true,
                            }}
                        />
                    </UserLocation>
                ) : null}

                <Camera
                    followUserLocation={navigationActive}
                    followUserMode={
                        navigationActive
                            ? UserTrackingMode.FollowWithHeading
                            : UserTrackingMode.Follow
                    }
                    followZoomLevel={19}
                    followPitch={60}
                    pitch={0}
                    onUserTrackingModeChange={(event) => {
                        if (
                            navigationActive &&
                            !event.nativeEvent.payload.followUserLocation
                        ) {
                            setNavigationActive(false);
                        }
                    }}
                />
            </MapView>
        </>
    );
}
