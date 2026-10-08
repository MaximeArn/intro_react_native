import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import CameraModal from "@/components/camera-modal";
import ImageSourceSheet, {
  type ImageSource,
} from "@/components/image-source-sheet";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { pickImageFromLibrary } from "@/utils/pick-image";

type Props = {
  // URI locale (caméra / galerie) ou distante (photo déjà enregistrée)
  uri: string | null;
  onChange: (uri: string | null) => void;
  disabled?: boolean;
  testID?: string;
};

// Format paysage des photos d'adresses et d'avis
const ASPECT: [number, number] = [4, 3];

export default function PhotoPickerField({
  uri,
  onChange,
  disabled,
  testID,
}: Props) {
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  const handleSource = async (source: ImageSource) => {
    if (source === "camera") setIsCameraVisible(true);
    if (source === "remove") onChange(null);
    if (source === "library") {
      const picked = await pickImageFromLibrary(ASPECT);
      if (picked) onChange(picked);
    }
  };

  return (
    <>
      <Pressable
        testID={testID}
        disabled={disabled}
        onPress={() => setIsSheetVisible(true)}
        style={({ pressed }) => [styles.frame, pressed && styles.pressed]}
      >
        {uri ? (
          <>
            <Image source={{ uri }} style={styles.image} contentFit="cover" />
            <View style={styles.changeChip}>
              <MaterialCommunityIcons
                name="camera-retake-outline"
                size={16}
                color={colors.onPrimary}
              />
              <Text style={styles.changeText}>Changer</Text>
            </View>
          </>
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.placeholderIcon}>
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={28}
                color={colors.primary}
              />
            </View>
            <Text style={styles.placeholderTitle}>Ajouter une photo</Text>
            <Text style={styles.placeholderText}>
              Appareil photo ou galerie
            </Text>
          </View>
        )}
      </Pressable>

      <ImageSourceSheet
        visible={isSheetVisible}
        canRemove={!!uri}
        onClose={() => setIsSheetVisible(false)}
        onSelect={handleSource}
      />
      <CameraModal
        visible={isCameraVisible}
        onClose={() => setIsCameraVisible(false)}
        onCapture={(captured) => {
          setIsCameraVisible(false);
          onChange(captured);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  frame: {
    aspectRatio: ASPECT[0] / ASPECT[1],
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.85,
  },
  image: {
    flex: 1,
  },
  changeChip: {
    position: "absolute",
    right: spacing.sm,
    bottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: "rgba(31, 42, 34, 0.65)",
  },
  changeText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.onPrimary,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.border,
  },
  placeholderIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: spacing.xs,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderTitle: {
    ...typography.body,
    fontWeight: "700",
  },
  placeholderText: {
    ...typography.caption,
  },
});
