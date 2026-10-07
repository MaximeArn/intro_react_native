import { StyleSheet, TextInput, type TextInputProps } from "react-native";

import { colors, radius, spacing } from "@/constants/theme";

export default function FormInput({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={colors.textMuted}
      autoCorrect={false}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 52,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontSize: 16,
    color: colors.text,
  },
});
