import { FlatList, StyleSheet, Text } from "react-native";

import IngredientCard from "@/components/ingredient-card";
import { data as ingredients } from "@/data/data.json";
import useShoppingStore from "@/stores/shoppingList.store";

export default function MyShoppingList() {
  const itemIds = useShoppingStore((state) => state.itemIds);
  const shoppingList = ingredients.filter((ingredient) =>
    itemIds.includes(ingredient.id),
  );

  return (
    <FlatList
      data={shoppingList}
      keyExtractor={(item) => item.id.toString()}
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
