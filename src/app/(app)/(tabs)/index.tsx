import { useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import AddIngredientButton from "@/components/add-ingredient-button";
import IngredientCard from "@/components/ingredient-card";
import { colors } from "@/constants/theme";
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
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        testID="products-list"
        data={ingredients}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => <IngredientCard ingredient={item} />}
        contentContainerStyle={styles.container}
      />
      <AddIngredientButton />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    paddingTop: 8,
    paddingHorizontal: 10,
    // Laisse de la place pour que le FAB ne cache pas la dernière carte
    paddingBottom: 100,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProductsList;
