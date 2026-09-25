import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

export default function AddIngredientButton() {
  return (
    <Link href="/ingredients/new" asChild>
      <Pressable
        hitSlop={8}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.text}>+ Ajouter</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 16,
  },
  pressed: {
    opacity: 0.5,
  },
  text: {
    color: "#2e7d32",
    fontSize: 15,
    fontWeight: "600",
  },
});
