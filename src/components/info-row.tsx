import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/constants/theme";

type Props = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value?: string;
  // Rend la ligne cliquable et affiche un chevron
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
};

export default function InfoRow({
  icon,
  label,
  value,
  onPress,
  disabled,
  testID,
}: Props) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={!onPress || disabled}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.label}>{label}</Text>
      {value && (
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      )}
      {onPress && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={colors.textMuted}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: 56,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    ...typography.body,
    fontWeight: "600",
  },
  value: {
    ...typography.body,
    flex: 1,
    textAlign: "right",
    color: colors.textMuted,
  },
});
