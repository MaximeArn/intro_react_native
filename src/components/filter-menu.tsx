import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { colors, radius, shadow, spacing, typography } from "@/constants/theme";

export type FilterOption<T extends string> = {
  value: T;
  label: string;
  count?: number;
  // Pastille de couleur (ex : couleur des pins correspondants sur la carte)
  dotColor?: string;
};

type Props<T extends string> = {
  // La première option est le filtre par défaut (aucun filtrage)
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  // Position du bouton (absolue, dans l'écran parent)
  style?: StyleProp<ViewStyle>;
};

// Bouton flottant qui ouvre un petit menu de filtres.
// À placer à la racine de l'écran : le fond qui ferme le menu le recouvre en entier.
export default function FilterMenu<T extends string>({
  options,
  value,
  onChange,
  style,
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  const isFiltered = value !== options[0]?.value;

  const select = (next: T) => {
    onChange(next);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <Pressable
          testID="filter-menu-backdrop"
          accessibilityLabel="Fermer le menu des filtres"
          style={StyleSheet.absoluteFill}
          onPress={() => setIsOpen(false)}
        />
      )}

      <View pointerEvents="box-none" style={[styles.anchor, style]}>
        <Pressable
          testID="filter-button"
          accessibilityRole="button"
          accessibilityLabel="Filtrer les adresses"
          accessibilityState={{ expanded: isOpen }}
          onPress={() => setIsOpen((open) => !open)}
          style={({ pressed }) => [
            styles.button,
            isFiltered && styles.buttonFiltered,
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons
            name="filter-variant"
            size={24}
            color={isFiltered ? colors.onPrimary : colors.primary}
          />
          {/* Filtre actif visible sans ouvrir le menu */}
          {isFiltered && selected && (
            <Text style={styles.buttonLabel}>{selected.label}</Text>
          )}
        </Pressable>

        {isOpen && (
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(100)}
            style={styles.menu}
            accessibilityRole="menu"
          >
            <Text style={styles.menuTitle}>Afficher</Text>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  testID={`filter-${option.value}`}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => select(option.value)}
                  style={({ pressed }) => [
                    styles.option,
                    isSelected && styles.optionSelected,
                    pressed && styles.optionPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: option.dotColor ?? "transparent" },
                      !option.dotColor && styles.dotEmpty,
                    ]}
                  />
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.count !== undefined && (
                    <Text style={styles.count}>{option.count}</Text>
                  )}
                  <MaterialCommunityIcons
                    name="check"
                    size={18}
                    color={isSelected ? colors.primary : "transparent"}
                  />
                </Pressable>
              );
            })}
          </Animated.View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: "absolute",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  button: {
    minWidth: 52,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: 14,
    borderRadius: 26,
    backgroundColor: colors.surface,
    ...shadow.button,
  },
  buttonFiltered: {
    paddingRight: 18,
    backgroundColor: colors.primary,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.onPrimary,
  },
  pressed: {
    opacity: 0.8,
  },
  menu: {
    width: 240,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  menuTitle: {
    ...typography.overline,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    height: 44,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  optionSelected: {
    backgroundColor: colors.primarySoft,
  },
  optionPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotEmpty: {
    borderWidth: 1.5,
    borderColor: colors.textMuted,
  },
  optionLabel: {
    ...typography.body,
    flex: 1,
    fontWeight: "600",
  },
  optionLabelSelected: {
    color: colors.primary,
  },
  count: {
    ...typography.caption,
    fontWeight: "700",
  },
});
