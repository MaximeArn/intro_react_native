import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { colors, radius, shadow, spacing } from "@/constants/theme";

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  testID?: string;
};

export default function PrimaryButton({
  label,
  onPress,
  loading = false,
  testID,
}: Props) {
  return (
    <Pressable
      testID={testID}
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        loading && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <Text style={styles.text}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    marginTop: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.button,
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    backgroundColor: colors.primaryDisabled,
  },
  text: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
});
