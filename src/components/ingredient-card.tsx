import { Pressable, StyleSheet, Text, View } from "react-native";

import { Ingredient } from "@/types/ingredient";
import { router } from "expo-router";

type IngredientCardProps = {
  ingredient: Ingredient;
};

export default function IngredientCard({ ingredient }: IngredientCardProps) {
  return (
    <Pressable onPress={() => router.push(`/ingredients/${ingredient.id}`)}>
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.name}>{ingredient.name}</Text>
          <Text style={styles.category}>{ingredient.category}</Text>
        </View>
        <Text style={styles.price}>{ingredient.price.toFixed(2)} €</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    // Ombre iOS
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    // Ombre Android
    elevation: 2,
  },
  info: {
    gap: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  category: {
    fontSize: 13,
    color: "#888",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2e7d32",
  },
});
