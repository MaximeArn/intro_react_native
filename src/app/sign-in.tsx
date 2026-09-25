import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import useAuthStore from "../stores/auth.store";

export default function SignIn() {
  const { signIn } = useAuthStore();
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => {
          signIn({
            email: "test@gmail.com",
            password: "test123!",
          });
          router.replace("/");
        }}
      >
        <Text style={styles.buttonText}>Se connecter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  button: {
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 220,
    alignItems: "center",
    // Ombre iOS
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    // Ombre Android
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
