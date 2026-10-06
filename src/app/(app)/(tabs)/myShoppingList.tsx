import { FlatList, StyleSheet, Text, View } from "react-native";

import IngredientCard from "@/components/ingredient-card";
import { colors, spacing, typography } from "@/constants/theme";
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
      numColumns={2}
      renderItem={({ item }) => <IngredientCard ingredient={item} />}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Ton panier est vide</Text>
          <Text style={styles.emptyText}>
            Ajoute des produits avec le bouton + depuis l'onglet Produits.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  empty: {
    alignItems: "center",
    gap: spacing.sm,
    marginTop: 64,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    ...typography.heading,
  },
  emptyText: {
    ...typography.caption,
    fontSize: 15,
    textAlign: "center",
    color: colors.textMuted,
  },
});
