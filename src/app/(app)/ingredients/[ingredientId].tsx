import { Stack, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radius, shadow, spacing, typography } from "@/constants/theme";
import useIngredientsStore from "@/stores/ingredients.store";

export default function IngredientDetail() {
  const { ingredientId } = useLocalSearchParams<{ ingredientId: string }>();
  const isLoading = useIngredientsStore((state) => state.isLoading);
  const ingredient = useIngredientsStore((state) =>
    state.ingredients.find((ingredient) => ingredient.id === ingredientId),
  );

  if (isLoading) {
    return (
      <View style={styles.notFound}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!ingredient) {
    return (
      <>
        <Stack.Screen options={{ title: "Introuvable" }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Ingrédient introuvable</Text>
        </View>
      </>
    );
  }

  const pricePerKg = (ingredient.price / ingredient.weight) * 1000;

  return (
    <>
      <Stack.Screen options={{ title: ingredient.name }} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{ingredient.category}</Text>
          </View>
          <Text style={styles.name}>{ingredient.name}</Text>
          <Text style={styles.price}>{ingredient.price.toFixed(2)} €</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{ingredient.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Origine</Text>
            <Text style={styles.value}>{ingredient.origin}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Poids</Text>
            <Text style={styles.value}>{ingredient.weight} g</Text>
          </View>
          <View style={[styles.row, styles.lastRow]}>
            <Text style={styles.label}>Prix au kilo</Text>
            <Text style={styles.value}>{pricePerKg.toFixed(2)} €/kg</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.md,
  },
  header: {
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  badge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  name: {
    ...typography.title,
  },
  price: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.accent,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow.card,
  },
  sectionTitle: {
    ...typography.overline,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 15,
    color: colors.textMuted,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
