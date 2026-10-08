import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Avatar from "@/components/avatar";
import CameraModal from "@/components/camera-modal";
import ImageSourceSheet, {
  type ImageSource,
} from "@/components/image-source-sheet";
import InfoRow from "@/components/info-row";
import SignOutButton from "@/components/sign-out-button";
import { colors, radius, shadow, spacing, typography } from "@/constants/theme";
import useAuthStore from "@/stores/auth.store";
import { getErrorMessage } from "@/utils/error-messages";
import { formatMonthYear } from "@/utils/format-date";
import { pickImageFromLibrary } from "@/utils/pick-image";

const AVATAR_SIZE = 112;
const AVATAR_RING = 4;
const BANNER_HEIGHT = 96;

// Pins décoratifs de la bannière : [gauche %, haut, taille, rotation]
const BANNER_PINS: [number, number, number, number][] = [
  [6, 14, 28, -12],
  [22, 52, 18, 8],
  [70, 10, 22, 10],
  [84, 46, 32, -8],
  [52, 60, 14, 0],
];

export default function Account() {
  const user = useAuthStore((state) => state.user);
  const updatePhoto = useAuthStore((state) => state.updatePhoto);
  const removePhoto = useAuthStore((state) => state.removePhoto);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = user?.email ?? "";
  const displayName = user?.displayName || email;
  const memberSince = formatMonthYear(user?.metadata.creationTime);
  const hasPhoto = !!user?.photoURL;

  const savePhoto = async (save: () => Promise<void>) => {
    setError(null);
    setIsSaving(true);
    try {
      await save();
    } catch (e) {
      setError(
        getErrorMessage(e, "Impossible de mettre à jour la photo, réessaie."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const pickFromLibrary = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) savePhoto(() => updatePhoto(uri));
  };

  const handleSource = (source: ImageSource) => {
    if (source === "camera") setIsCameraVisible(true);
    if (source === "library") pickFromLibrary();
    if (source === "remove") savePhoto(removePhoto);
  };

  const openPhotoSheet = () => setIsSheetVisible(true);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <View style={styles.banner}>
          {BANNER_PINS.map(([left, top, size, rotate], index) => (
            <MaterialCommunityIcons
              key={index}
              name="map-marker"
              size={size}
              color={colors.primary}
              style={[
                styles.bannerPin,
                {
                  left: `${left}%`,
                  top,
                  transform: [{ rotate: `${rotate}deg` }],
                },
              ]}
            />
          ))}
        </View>

        <Pressable
          testID="edit-avatar-button"
          accessibilityLabel="Modifier la photo de profil"
          disabled={isSaving}
          onPress={openPhotoSheet}
          style={({ pressed }) => [
            styles.avatarRing,
            pressed && styles.pressed,
          ]}
        >
          <Avatar name={displayName} uri={user?.photoURL} size={AVATAR_SIZE} />
          {isSaving && (
            <View style={styles.savingOverlay}>
              <ActivityIndicator color={colors.onPrimary} />
            </View>
          )}
          <View style={styles.editBadge}>
            <MaterialCommunityIcons
              name="camera"
              size={16}
              color={colors.onPrimary}
            />
          </View>
        </Pressable>

        <View style={styles.identity}>
          <Text
            testID="account-display-name"
            style={styles.name}
            numberOfLines={1}
          >
            {displayName}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {email}
          </Text>
          {memberSince && (
            <View style={styles.chip}>
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={14}
                color={colors.primary}
              />
              <Text style={styles.chipText}>Membre depuis {memberSince}</Text>
            </View>
          )}
        </View>

        {error && (
          <View testID="account-photo-error" style={styles.error}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={18}
              color={colors.accent}
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mon compte</Text>
        <View style={styles.group}>
          <InfoRow icon="account-outline" label="Pseudo" value={displayName} />
          <View style={styles.separator} />
          <InfoRow icon="email-outline" label="Email" value={email} />
          <View style={styles.separator} />
          <InfoRow
            testID="edit-photo-row"
            icon="camera-outline"
            label="Photo de profil"
            value={hasPhoto ? "Modifier" : "Ajouter"}
            disabled={isSaving}
            onPress={openPhotoSheet}
          />
        </View>
      </View>

      <SignOutButton />

      <ImageSourceSheet
        visible={isSheetVisible}
        title="Photo de profil"
        canRemove={hasPhoto}
        onClose={() => setIsSheetVisible(false)}
        onSelect={handleSource}
      />
      <CameraModal
        visible={isCameraVisible}
        initialFacing="front"
        onClose={() => setIsCameraVisible(false)}
        onCapture={(uri) => {
          setIsCameraVisible(false);
          savePhoto(() => updatePhoto(uri));
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  hero: {
    alignItems: "center",
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  banner: {
    alignSelf: "stretch",
    height: BANNER_HEIGHT,
    marginHorizontal: -spacing.md,
    backgroundColor: colors.primarySoft,
  },
  bannerPin: {
    position: "absolute",
    opacity: 0.18,
  },
  avatarRing: {
    // L'avatar chevauche la bannière
    marginTop: -(AVATAR_SIZE / 2 + AVATAR_RING),
    padding: AVATAR_RING,
    borderRadius: AVATAR_SIZE / 2 + AVATAR_RING,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.85,
  },
  savingOverlay: {
    position: "absolute",
    top: AVATAR_RING,
    left: AVATAR_RING,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "rgba(31, 42, 34, 0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    position: "absolute",
    right: AVATAR_RING,
    bottom: AVATAR_RING,
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 3,
    borderColor: colors.surface,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  identity: {
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
    maxWidth: "100%",
  },
  name: {
    ...typography.title,
    fontSize: 26,
  },
  email: {
    ...typography.body,
    color: colors.textMuted,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.sm,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
  error: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    alignSelf: "stretch",
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: colors.accent,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.overline,
    paddingHorizontal: spacing.xs,
  },
  group: {
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    // Aligné sur le texte, après l'icône
    marginLeft: spacing.md + 36 + spacing.md,
    backgroundColor: colors.border,
  },
});
