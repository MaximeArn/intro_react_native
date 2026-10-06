import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radius, shadow, spacing } from "@/constants/theme";

// Bouton flottant étendu (icône + libellé) en bas à droite de l'écran
export default function AddIngredientButton() {
  return (
    <Pressable
      testID="add-ingredient-button"
      onPress={() => router.push("/ingredients/new")}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <MaterialCommunityIcons name="plus" size={22} color={colors.onPrimary} />
      <Text style={styles.text}>Nouveau produit</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    height: 56,
    paddingLeft: spacing.md,
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    ...shadow.button,
  },
  pressed: {
    backgroundColor: colors.primaryPressed,
    transform: [{ scale: 0.97 }],
  },
  text: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
});
