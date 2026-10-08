import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Location from "expo-location";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import { DEFAULT_REGION, regionAround } from "@/constants/map";
import { colors, radius, shadow, spacing, typography } from "@/constants/theme";
import { type Coordinates, useUserLocation } from "@/hooks/use-user-location";
import { formatGeocodedAddress } from "@/utils/format-address";

export type LocationValue = {
  coordinates: Coordinates | null;
  // undefined : géocodage en cours · null : aucune adresse trouvée
  formattedAddress?: string | null;
};

type Props = {
  value: LocationValue;
  // Doit être stable (ex : setState) : il est utilisé dans des effets
  onChange: (value: LocationValue) => void;
  disabled?: boolean;
};

export default function LocationPicker({ value, onChange, disabled }: Props) {
  const mapRef = useRef<MapView>(null);
  const { coords: userCoords, locate } = useUserLocation();
  const { coordinates, formattedAddress } = value;

  const select = (next: Coordinates, recenter = false) => {
    onChange({ coordinates: next, formattedAddress: undefined });
    if (recenter)
      mapRef.current?.animateToRegion(regionAround(next, 0.01), 500);
  };

  // Sans position choisie (pas de pin posé depuis la carte d'accueil),
  // on part de la position de l'utilisateur dès qu'elle est connue
  useEffect(() => {
    if (!coordinates && userCoords) {
      onChange({ coordinates: userCoords, formattedAddress: undefined });
      mapRef.current?.animateToRegion(regionAround(userCoords, 0.01), 500);
    }
  }, [coordinates, userCoords, onChange]);

  // Géocodage inverse à chaque nouvelle position ; une réponse arrivée après
  // un nouveau déplacement du pin est ignorée
  useEffect(() => {
    if (!coordinates || formattedAddress !== undefined) return;
    let cancelled = false;
    Location.reverseGeocodeAsync(coordinates)
      .then(([place]) => formatGeocodedAddress(place))
      .catch(() => null)
      .then((address) => {
        if (!cancelled) onChange({ coordinates, formattedAddress: address });
      });
    return () => {
      cancelled = true;
    };
  }, [coordinates, formattedAddress, onChange]);

  const centerOnUser = async () => {
    const position = (await locate()) ?? userCoords;
    if (position) select(position, true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapFrame}>
        <MapView
          ref={mapRef}
          testID="location-picker-map"
          style={StyleSheet.absoluteFill}
          initialRegion={
            coordinates ? regionAround(coordinates, 0.01) : DEFAULT_REGION
          }
          showsUserLocation
          showsCompass={false}
          scrollEnabled={!disabled}
          zoomEnabled={!disabled}
          onPress={(event) => {
            if (!disabled) select(event.nativeEvent.coordinate);
          }}
        >
          {coordinates && (
            <Marker
              coordinate={coordinates}
              draggable={!disabled}
              pinColor={colors.accent}
              onDragEnd={(event) => select(event.nativeEvent.coordinate)}
            />
          )}
        </MapView>

        <Pressable
          testID="location-picker-locate"
          accessibilityLabel="Utiliser ma position"
          disabled={disabled}
          onPress={centerOnUser}
          style={({ pressed }) => [styles.locate, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons
            name="crosshairs-gps"
            size={20}
            color={colors.primary}
          />
        </Pressable>
      </View>

      <View style={styles.addressRow}>
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={20}
          color={colors.accent}
        />
        {coordinates && formattedAddress === undefined ? (
          <>
            <ActivityIndicator size="small" color={colors.textMuted} />
            <Text style={styles.addressMuted}>Recherche de l’adresse…</Text>
          </>
        ) : (
          <Text
            testID="location-picker-address"
            style={coordinates ? styles.address : styles.addressMuted}
            numberOfLines={2}
          >
            {!coordinates
              ? "Touche la carte pour placer l’adresse"
              : (formattedAddress ?? "Position sans adresse précise")}
          </Text>
        )}
      </View>
      <Text style={styles.hint}>
        Touche la carte ou fais glisser le pin pour ajuster la position.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  mapFrame: {
    height: 200,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  locate: {
    position: "absolute",
    right: spacing.sm,
    bottom: spacing.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.button,
  },
  pressed: {
    opacity: 0.7,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  address: {
    ...typography.body,
    flex: 1,
    fontWeight: "600",
  },
  addressMuted: {
    ...typography.body,
    flex: 1,
    color: colors.textMuted,
  },
  hint: {
    ...typography.caption,
  },
});
