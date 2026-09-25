import { Pressable, StyleSheet, Text, View } from "react-native";

import useShoppingStore from "@/stores/shoppingList.store";
import { Ingredient } from "@/types/ingredient";
import { router } from "expo-router";

type IngredientCardProps = {
  ingredient: Ingredient;
};

export default function IngredientCard({ ingredient }: IngredientCardProps) {
  const addItem = useShoppingStore((state) => state.addItem);
  const removeItem = useShoppingStore((state) => state.removeItem);
  const isInList = useShoppingStore((state) =>
    state.itemIds.includes(ingredient.id),
  );

  const toggleItem = () =>
    isInList ? removeItem(ingredient.id) : addItem(ingredient.id);

  return (
    <Pressable onPress={() => router.push(`/ingredients/${ingredient.id}`)}>
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.name}>{ingredient.name}</Text>
          <Text style={styles.category}>{ingredient.category}</Text>
        </View>
        <View style={styles.actions}>
          <Text style={styles.price}>{ingredient.price.toFixed(2)} €</Text>
          <Pressable
            style={[styles.button, isInList && styles.removeButton]}
            onPress={toggleItem}
            hitSlop={8}
          >
            <Text style={styles.buttonText}>{isInList ? "−" : "+"}</Text>
          </Pressable>
        </View>
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
    fontSize: 14,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2e7d32",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButton: {
    backgroundColor: "#c62828",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
