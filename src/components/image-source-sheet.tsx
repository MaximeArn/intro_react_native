import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRef } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, radius, spacing, typography } from "@/constants/theme";

export type ImageSource = "camera" | "library" | "remove";

type Props = {
  visible: boolean;
  title?: string;
  // Affiche l'option de suppression (ex : une photo existe déjà)
  canRemove?: boolean;
  onClose: () => void;
  onSelect: (source: ImageSource) => void;
};

type Option = {
  source: ImageSource;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  destructive?: boolean;
};

export default function ImageSourceSheet({
  visible,
  title = "Ajouter une photo",
  canRemove = false,
  onClose,
  onSelect,
}: Props) {
  const insets = useSafeAreaInsets();
  const pendingSource = useRef<ImageSource | null>(null);

  const options: Option[] = [
    { source: "camera", label: "Prendre une photo", icon: "camera" },
    { source: "library", label: "Choisir dans la galerie", icon: "image" },
    ...(canRemove
      ? [
          {
            source: "remove" as const,
            label: "Supprimer la photo",
            icon: "trash-can-outline" as const,
            destructive: true,
          },
        ]
      : []),
  ];

  const flushPendingSource = () => {
    const source = pendingSource.current;
    pendingSource.current = null;
    if (source) onSelect(source);
  };

  const handlePress = (source: ImageSource) => {
    pendingSource.current = source;
    onClose();
    // iOS refuse d'ouvrir la caméra / galerie pendant la fermeture de la modale :
    // on attend onDismiss (iOS uniquement) avant de transmettre le choix
    if (Platform.OS !== "ios") flushPendingSource();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onDismiss={flushPendingSource}
    >
      <Pressable
        testID="image-source-backdrop"
        style={styles.backdrop}
        onPress={onClose}
      />
      <View
        style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <Text style={styles.title}>{title}</Text>
        {options.map(({ source, label, icon, destructive }) => {
          const color = destructive ? colors.accent : colors.text;
          return (
            <Pressable
              key={source}
              testID={`image-source-${source}`}
              onPress={() => handlePress(source)}
              style={({ pressed }) => [
                styles.option,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons name={icon} size={22} color={color} />
              <Text style={[styles.optionText, { color }]}>{label}</Text>
            </Pressable>
          );
        })}
        <Pressable
          testID="image-source-cancel"
          onPress={onClose}
          style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}
        >
          <Text style={styles.cancelText}>Annuler</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(31, 42, 34, 0.35)",
  },
  sheet: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.overline,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    height: 52,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  cancel: {
    height: 52,
    marginTop: spacing.sm,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.6,
  },
});
