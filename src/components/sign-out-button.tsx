import { Pressable, StyleSheet, Text } from "react-native";

import useAuthStore from "@/stores/auth.store";

export default function SignOutButton() {
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <Pressable
      onPress={signOut}
      hitSlop={8}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.text}>Déconnexion</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 16,
  },
  pressed: {
    opacity: 0.5,
  },
  text: {
    color: "#c62828",
    fontSize: 15,
    fontWeight: "600",
  },
});
