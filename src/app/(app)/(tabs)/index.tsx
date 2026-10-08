import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DEFAULT_REGION, regionAround } from "@/constants/map";
import { colors, radius, shadow, spacing, typography } from "@/constants/theme";
import { type Coordinates, useUserLocation } from "@/hooks/use-user-location";
import useAddressesStore from "@/stores/addresses.store";
import useAuthStore from "@/stores/auth.store";
import type { Address } from "@/types/address";

// Couleur du pin : mes adresses publiques, mes adresses privées, celles des autres
const pinColor = (address: Address, isMine: boolean) => {
  if (!isMine) return colors.accent;
  return address.isPublic ? colors.primary : colors.textMuted;
};

const openNewAddress = (coordinates?: Coordinates) =>
  router.push({
    pathname: "/addresses/new",
    params: coordinates && {
      latitude: String(coordinates.latitude),
      longitude: String(coordinates.longitude),
    },
  });

export default function Home() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const hasCentered = useRef(false);
  const { status, coords, canAskAgain, locate } = useUserLocation();
  const userId = useAuthStore((state) => state.user?.uid);
  const addresses = useAddressesStore((state) => state.addresses);
  const addressesError = useAddressesStore((state) => state.error);

  // Centre automatiquement la carte la première fois que la position arrive
  useEffect(() => {
    if (coords && !hasCentered.current) {
      hasCentered.current = true;
      mapRef.current?.animateToRegion(regionAround(coords), 800);
    }
  }, [coords]);

  const recenter = async () => {
    if (status === "denied" && !canAskAgain) {
      Linking.openSettings();
      return;
    }
    const position = (await locate()) ?? coords;
    if (position) mapRef.current?.animateToRegion(regionAround(position), 600);
  };

  return (
    <View testID="home-screen" style={styles.container}>
      <MapView
        ref={mapRef}
        testID="home-map"
        style={StyleSheet.absoluteFill}
        initialRegion={DEFAULT_REGION}
        showsUserLocation={status === "granted"}
        showsCompass={false}
        // Laisse de la place au bandeau et aux boutons flottants
        mapPadding={{ top: insets.top, right: 0, bottom: 0, left: 0 }}
        // Appui long : nouvelle adresse à l'endroit touché
        onLongPress={(event) => openNewAddress(event.nativeEvent.coordinate)}
      >
        {addresses.map((address) => {
          const isMine = address.ownerId === userId;
          return (
            <Marker
              key={address.id}
              testID={`address-marker-${address.id}`}
              coordinate={address.location}
              pinColor={pinColor(address, isMine)}
              onPress={() =>
                router.push({
                  pathname: "/addresses/[id]",
                  params: { id: address.id },
                })
              }
            />
          );
        })}
      </MapView>

      {addressesError && (
        <View
          testID="addresses-error-banner"
          style={[
            styles.banner,
            { top: insets.top + spacing.sm + (status === "denied" ? 96 : 0) },
          ]}
        >
          <MaterialCommunityIcons
            name="cloud-alert-outline"
            size={22}
            color={colors.accent}
          />
          <Text style={[styles.bannerText, styles.bannerContent]}>
            {addressesError}
          </Text>
        </View>
      )}

      {status === "denied" && (
        <View
          testID="location-denied-banner"
          style={[styles.banner, { top: insets.top + spacing.sm }]}
        >
          <MaterialCommunityIcons
            name="map-marker-off-outline"
            size={22}
            color={colors.accent}
          />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Localisation désactivée</Text>
            <Text style={styles.bannerText}>
              Active-la pour centrer la carte sur ta position.
            </Text>
          </View>
          <Pressable
            onPress={recenter}
            hitSlop={8}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={styles.bannerAction}>
              {canAskAgain ? "Activer" : "Réglages"}
            </Text>
          </Pressable>
        </View>
      )}

      <View style={styles.fabs}>
        <Pressable
          testID="recenter-button"
          accessibilityLabel="Centrer la carte sur ma position"
          onPress={recenter}
          style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons
            name={status === "granted" ? "crosshairs-gps" : "crosshairs"}
            size={24}
            color={colors.primary}
          />
        </Pressable>
        <Pressable
          testID="add-address-button"
          accessibilityLabel="Ajouter une adresse"
          onPress={() => openNewAddress()}
          style={({ pressed }) => [
            styles.fab,
            styles.fabPrimary,
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons
            name="map-marker-plus"
            size={28}
            color={colors.onPrimary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  bannerContent: {
    flex: 1,
    gap: 2,
  },
  bannerTitle: {
    ...typography.body,
    fontWeight: "700",
  },
  bannerText: {
    ...typography.caption,
  },
  bannerAction: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
  },
  fabs: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.md,
    alignItems: "center",
    gap: spacing.sm,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.button,
  },
  fabPrimary: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
});
