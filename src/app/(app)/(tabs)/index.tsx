import { useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import IngredientCard from "@/components/ingredient-card";
import useIngredientsStore from "@/stores/ingredients.store";

const ProductsList = () => {
  const ingredients = useIngredientsStore((state) => state.ingredients);
  const isLoading = useIngredientsStore((state) => state.isLoading);
  const fetchIngredients = useIngredientsStore(
    (state) => state.fetchIngredients,
  );

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      testID="products-list"
      data={ingredients}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <IngredientCard ingredient={item} />}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProductsList;
