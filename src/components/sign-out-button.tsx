import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

import { colors, radius } from "@/constants/theme";
import useAuthStore from "@/stores/auth.store";

export default function SignOutButton() {
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <Pressable
      testID="sign-out-button"
      onPress={() =>
        signOut().catch(() =>
          Alert.alert("Déconnexion impossible", "Réessaie dans un instant."),
        )
      }
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <MaterialCommunityIcons name="logout" size={20} color={colors.accent} />
      <Text style={styles.text}>Se déconnecter</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "700",
  },
});
