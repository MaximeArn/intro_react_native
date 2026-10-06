import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import useAuthStore from "../stores/auth.store";

export default function SignIn() {
  const { signIn } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bienvenu !</Text>
      <TextInput
        testID="email-input"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        autoComplete="email"
      />
      <TextInput
        testID="password-input"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        autoCorrect={false}
        secureTextEntry
        autoComplete="current-password"
      />
      <Pressable
        testID="sign-in-button"
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => {
          signIn({ email, password });
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
  welcomeText: {
    fontSize: 26,
    fontWeight: "800",
  },
  button: {
    width: "80%",
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
  input: {
    borderRadius: 5,
    width: "80%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
