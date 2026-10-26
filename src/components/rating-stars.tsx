import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, StyleSheet, View } from "react-native";

import { colors } from "@/constants/theme";

const STAR_COLOR = "#E0A526";

type Props = {
  value: number;
  size?: number;
  // Rend les étoiles cliquables (saisie d'une note)
  onChange?: (value: number) => void;
  disabled?: boolean;
};

const iconFor = (position: number, value: number) => {
  if (value >= position) return "star";
  if (value >= position - 0.5) return "star-half-full";
  return "star-outline";
};

export default function RatingStars({
  value,
  size = 16,
  onChange,
  disabled,
}: Props) {
  return (
    <View
      style={[styles.row, { gap: onChange ? size / 4 : 1 }]}
      accessibilityRole={onChange ? "adjustable" : "image"}
      accessibilityLabel={`${value} sur 5`}
    >
      {[1, 2, 3, 4, 5].map((position) => {
        const icon = (
          <MaterialCommunityIcons
            name={iconFor(position, value)}
            size={size}
            color={value >= position - 0.5 ? STAR_COLOR : colors.border}
          />
        );
        return onChange ? (
          <Pressable
            key={position}
            testID={`rating-star-${position}`}
            disabled={disabled}
            onPress={() => onChange(position)}
            hitSlop={4}
          >
            {icon}
          </Pressable>
        ) : (
          <View key={position}>{icon}</View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
