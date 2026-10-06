import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, shadow, spacing } from "@/constants/theme";
import useShoppingStore from "@/stores/shoppingList.store";
import { Ingredient } from "@/types/ingredient";

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
    // Cellule à 50 % de largeur : 2 cartes par ligne
    <View style={styles.cell}>
      <Pressable
        onPress={() => router.push(`/ingredients/${ingredient.id}`)}
        style={({ pressed }) => [
          styles.card,
          isInList && styles.cardInList,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={1}>
            {ingredient.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {ingredient.weight} g
          </Text>

          <View style={styles.footer}>
            <Text style={styles.price}>{ingredient.price.toFixed(2)} €</Text>
            <Pressable
              accessibilityLabel={
                isInList ? "Retirer du panier" : "Ajouter au panier"
              }
              onPress={toggleItem}
              hitSlop={8}
              style={({ pressed }) => [
                styles.toggle,
                isInList && styles.toggleActive,
                pressed && styles.togglePressed,
              ]}
            >
              <MaterialCommunityIcons
                name={isInList ? "basket-check" : "basket-plus-outline"}
                size={20}
                color={isInList ? colors.onPrimary : colors.primary}
              />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: "50%",
    padding: 6,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: "hidden",
    ...shadow.card,
  },
  // outline est dessiné autour de la carte sans changer sa taille
  cardInList: {
    outlineWidth: 2,
    outlineColor: colors.primary,
    outlineStyle: "solid",
  },
  cardPressed: {
    opacity: 0.85,
  },
  body: {
    padding: 12,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  meta: {
    fontSize: 12,
    color: colors.textMuted,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  price: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
  toggle: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  togglePressed: {
    transform: [{ scale: 0.9 }],
  },
});
