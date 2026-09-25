import { FlatList, StyleSheet, Text } from "react-native";

import IngredientCard from "@/components/ingredient-card";
import useIngredientsStore from "@/stores/ingredients.store";
import useShoppingStore from "@/stores/shoppingList.store";

export default function MyShoppingList() {
  const ingredients = useIngredientsStore((state) => state.ingredients);
  const itemIds = useShoppingStore((state) => state.itemIds);
  const shoppingList = ingredients.filter((ingredient) =>
    itemIds.includes(ingredient.id),
  );

  return (
    <FlatList
      data={shoppingList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <IngredientCard ingredient={item} />}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <Text style={styles.empty}>Ta liste de courses est vide</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  empty: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 16,
    color: "#888",
  },
});
