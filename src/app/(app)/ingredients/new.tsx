import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

import { colors, radius, shadow, spacing, typography } from "@/constants/theme";
import { Ingredient } from "@/types/ingredient";
import useIngredientsStore from "../../../stores/ingredients.store";

export default function NewIngredient() {
  const addItem = useIngredientsStore((state) => state.addItem);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [origin, setOrigin] = useState("");
  const [price, setPrice] = useState("");
  const [weight, setWeight] = useState("");

  // Les TextInput renvoient toujours des strings : on convertit les champs numériques
  const parsedPrice = Number.parseFloat(price.replace(",", "."));
  const parsedWeight = Number.parseInt(weight, 10);

  const isValid =
    name.trim() !== "" &&
    category.trim() !== "" &&
    origin.trim() !== "" &&
    !Number.isNaN(parsedPrice) &&
    !Number.isNaN(parsedWeight);

  const handleSubmit = async () => {
    const newIngredient: Omit<Ingredient, "id"> = {
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      origin: origin.trim(),
      price: parsedPrice,
      weight: parsedWeight,
    };

    try {
      await addItem(newIngredient);
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <FormField label="Nom" value={name} onChangeText={setName} />
      <FormField
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.multiline}
      />
      <FormField
        label="Catégorie"
        value={category}
        onChangeText={setCategory}
      />
      <FormField label="Origine" value={origin} onChangeText={setOrigin} />

      <View style={styles.row}>
        <FormField
          label="Prix (€)"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          containerStyle={styles.rowItem}
        />
        <FormField
          label="Poids (g)"
          value={weight}
          onChangeText={setWeight}
          keyboardType="number-pad"
          containerStyle={styles.rowItem}
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          !isValid && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleSubmit}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>Créer le produit</Text>
      </Pressable>
    </ScrollView>
  );
}

type FormFieldProps = TextInputProps & {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
};

function FormField({
  label,
  containerStyle,
  style,
  ...inputProps
}: FormFieldProps) {
  return (
    <View style={[styles.field, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.textMuted}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.md,
  },
  field: {
    gap: 6,
  },
  label: {
    ...typography.overline,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  button: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
    ...shadow.button,
  },
  buttonDisabled: {
    backgroundColor: colors.primaryDisabled,
    boxShadow: "none",
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
  },
  buttonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
});
