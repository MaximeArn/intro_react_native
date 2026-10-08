import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/constants/theme";

type Props = {
  isPublic: boolean;
  onChange: (isPublic: boolean) => void;
  disabled?: boolean;
};

const OPTIONS = [
  {
    isPublic: false,
    icon: "lock-outline",
    label: "Privée",
    description: "Visible uniquement par toi",
    testID: "visibility-private",
  },
  {
    isPublic: true,
    icon: "earth",
    label: "Publique",
    description: "Visible par tous les utilisateurs",
    testID: "visibility-public",
  },
] as const;

export default function VisibilityToggle({
  isPublic,
  onChange,
  disabled,
}: Props) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {OPTIONS.map((option) => {
        const selected = option.isPublic === isPublic;
        return (
          <Pressable
            key={option.label}
            testID={option.testID}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => onChange(option.isPublic)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <View style={styles.header}>
              <MaterialCommunityIcons
                name={option.icon}
                size={20}
                color={selected ? colors.primary : colors.textMuted}
              />
              <Text style={[styles.label, selected && styles.labelSelected]}>
                {option.label}
              </Text>
              {selected && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={18}
                  color={colors.primary}
                  style={styles.check}
                />
              )}
            </View>
            <Text style={styles.description}>{option.description}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  label: {
    ...typography.body,
    fontWeight: "700",
    color: colors.textMuted,
  },
  labelSelected: {
    color: colors.primary,
  },
  check: {
    marginLeft: "auto",
  },
  description: {
    ...typography.caption,
  },
});
