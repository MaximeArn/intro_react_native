import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import {
  colors,
  radius,
  shadow,
  spacing,
  typography,
} from "@/constants/theme";
import carrotAnimation from "../../assets/lotties/carrot.json";
import useAuthStore from "../stores/auth.store";

export default function SignIn() {
  const { signIn } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LottieView
          source={carrotAnimation}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.brand}>Mes Bonnes Adresses</Text>
        <Text style={styles.tagline}>Tes lieux favoris, au même endroit.</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          testID="email-input"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
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
          placeholder="Mot de passe"
          placeholderTextColor={colors.textMuted}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.xl,
    backgroundColor: colors.background,
  },
  header: {
    gap: spacing.xs,
  },
  animation: {
    // Même ratio que l'animation (400 × 280)
    width: 220,
    height: 154,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  brand: {
    ...typography.title,
    fontSize: 40,
    color: colors.primary,
  },
  tagline: {
    ...typography.body,
    color: colors.textMuted,
  },
  form: {
    gap: 12,
  },
  input: {
    height: 52,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    height: 52,
    marginTop: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.button,
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
});
