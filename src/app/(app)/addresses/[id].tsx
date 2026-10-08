import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import DestructiveButton from "@/components/destructive-button";
import { regionAround } from "@/constants/map";
import { colors, radius, shadow, spacing, typography } from "@/constants/theme";
import { deleteAddress } from "@/services/addresses";
import useAddressesStore from "@/stores/addresses.store";
import useAuthStore from "@/stores/auth.store";
import type { Address } from "@/types/address";
import { getErrorMessage } from "@/utils/error-messages";
import { formatLongDate } from "@/utils/format-date";

// Ouvre l'itinéraire dans l'app de cartes du téléphone
const openDirections = ({ location, name }: Address) => {
  const { latitude, longitude } = location;
  const url = Platform.select({
    ios: `http://maps.apple.com/?daddr=${latitude},${longitude}`,
    default: `geo:0,0?q=${latitude},${longitude}(${encodeURIComponent(name)})`,
  });
  Linking.openURL(url);
};

export default function AddressDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // L'adresse vient du store temps réel : la fiche suit les modifications
  const address = useAddressesStore((state) =>
    state.addresses.find((item) => item.id === id),
  );
  const isLoading = useAddressesStore((state) => state.isLoading);
  const userId = useAuthStore((state) => state.user?.uid);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pendant la suppression, l'adresse disparaît du store avant la fermeture
  if (!address || isDeleting) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: "" }} />
        {isLoading || isDeleting ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            <MaterialCommunityIcons
              name="map-marker-question-outline"
              size={48}
              color={colors.textMuted}
            />
            <Text style={styles.notFoundText}>
              Cette adresse n’existe plus ou n’est pas accessible.
            </Text>
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.link}>Retour</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  const isMine = address.ownerId === userId;
  const createdAt = formatLongDate(address.createdAt);

  const confirmDelete = () =>
    Alert.alert(
      "Supprimer cette adresse ?",
      "Elle disparaîtra de ta carte et de celle des autres. Cette action est définitive.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteAddress(address);
              router.back();
            } catch (e) {
              setIsDeleting(false);
              Alert.alert(
                "Suppression impossible",
                getErrorMessage(e, "L’adresse n’a pas pu être supprimée."),
              );
            }
          },
        },
      ],
    );

  return (
    <>
      <Stack.Screen options={{ title: address.name }} />

      <ScrollView contentContainerStyle={styles.container}>
        {address.photoURL ? (
          <Image
            testID="address-photo"
            source={{ uri: address.photoURL }}
            style={styles.photo}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]}>
            <MaterialCommunityIcons
              name="image-off-outline"
              size={40}
              color={colors.primary}
            />
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.header}>
            <View
              style={[
                styles.badge,
                address.isPublic ? styles.badgePublic : styles.badgePrivate,
              ]}
            >
              <MaterialCommunityIcons
                name={address.isPublic ? "earth" : "lock-outline"}
                size={14}
                color={address.isPublic ? colors.primary : colors.textMuted}
              />
              <Text
                style={[
                  styles.badgeText,
                  !address.isPublic && styles.badgeTextPrivate,
                ]}
              >
                {address.isPublic ? "Publique" : "Privée"}
              </Text>
            </View>

            <Text testID="address-name" style={styles.name}>
              {address.name}
            </Text>
            <Text style={styles.meta}>
              {isMine ? "Ajoutée par toi" : `Ajoutée par ${address.ownerName}`}
              {createdAt && ` · le ${createdAt}`}
            </Text>
          </View>

          <Text
            testID="address-description"
            style={address.description ? styles.description : styles.empty}
          >
            {address.description || "Pas de description."}
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emplacement</Text>
            <View style={styles.card}>
              <View style={styles.mapFrame}>
                <MapView
                  style={StyleSheet.absoluteFill}
                  initialRegion={regionAround(address.location, 0.008)}
                  // Aperçu figé : l'itinéraire se fait dans l'app de cartes
                  scrollEnabled={false}
                  zoomEnabled={false}
                  rotateEnabled={false}
                  pitchEnabled={false}
                >
                  <Marker
                    coordinate={address.location}
                    pinColor={colors.accent}
                  />
                </MapView>
              </View>
              <View style={styles.locationRow}>
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={20}
                  color={colors.accent}
                />
                <Text style={styles.locationText} numberOfLines={2}>
                  {address.formattedAddress ?? "Position sans adresse précise"}
                </Text>
                <Pressable
                  testID="address-directions"
                  onPress={() => openDirections(address)}
                  style={({ pressed }) => [
                    styles.directions,
                    pressed && styles.pressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="directions"
                    size={18}
                    color={colors.onPrimary}
                  />
                  <Text style={styles.directionsText}>Itinéraire</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {isMine && (
            <DestructiveButton
              testID="address-delete"
              label="Supprimer l’adresse"
              icon="trash-can-outline"
              onPress={confirmDelete}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.lg,
  },
  notFoundText: {
    ...typography.body,
    textAlign: "center",
    color: colors.textMuted,
  },
  link: {
    ...typography.body,
    fontWeight: "700",
    color: colors.primary,
  },
  photo: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: colors.surfaceMuted,
  },
  photoPlaceholder: {
    aspectRatio: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft,
  },
  content: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginBottom: spacing.xs,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },
  badgePublic: {
    backgroundColor: colors.primarySoft,
  },
  badgePrivate: {
    backgroundColor: colors.surfaceMuted,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  badgeTextPrivate: {
    color: colors.textMuted,
  },
  name: {
    ...typography.title,
    fontSize: 28,
  },
  meta: {
    ...typography.caption,
    fontSize: 14,
  },
  description: {
    ...typography.body,
    lineHeight: 24,
  },
  empty: {
    ...typography.body,
    fontStyle: "italic",
    color: colors.textMuted,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.overline,
  },
  card: {
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  mapFrame: {
    height: 160,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
  },
  locationText: {
    ...typography.body,
    flex: 1,
    fontWeight: "600",
  },
  directions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  directionsText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.onPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
});
