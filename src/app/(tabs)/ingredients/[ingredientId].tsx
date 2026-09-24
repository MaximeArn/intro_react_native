import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { data as ingredients } from "../../../data/data.json";

export default function IngredientDetail() {
  const { ingredientId } = useLocalSearchParams<{ ingredientId: string }>();
  const ingredient = ingredients.find(
    (ingredient) => ingredient.id.toString() === ingredientId,
  );

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
    padding: 16,
    gap: 16,
  },
  header: {
    alignItems: "flex-start",
    gap: 8,
    paddingVertical: 8,
  },
  badge: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2e7d32",
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2e7d32",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 8,
    // Ombre iOS
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    // Ombre Android
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 15,
    color: "#666",
  },
  value: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    fontSize: 16,
    color: "#888",
  },
});
