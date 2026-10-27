import { Link } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import FormInput from "@/components/form-input";
import MapPinAnimation from "@/components/map-pin-animation";
import PrimaryButton from "@/components/primary-button";
import { colors, spacing, typography } from "@/constants/theme";
import useAuthStore from "@/stores/auth.store";
import { getErrorMessage } from "@/utils/error-messages";

export default function SignIn() {
  const signIn = useAuthStore((state) => state.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError("Renseigne ton email et ton mot de passe.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      // Une fois connecté, la navigation protégée bascule seule vers l'app
      await signIn({ email: email.trim(), password });
    } catch (e) {
      setError(getErrorMessage(e, "Connexion impossible, réessaie."));
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.header}>
          <MapPinAnimation />
          <Text style={styles.brand}>Mes Bonnes Adresses</Text>
          <Text style={styles.tagline}>
            Tes lieux favoris, au même endroit.
          </Text>
        </View>

        <View style={styles.form}>
          <FormInput
            testID="email-input"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <FormInput
            testID="password-input"
            value={password}
            onChangeText={setPassword}
            placeholder="Mot de passe"
            secureTextEntry
            autoComplete="current-password"
          />

          {error && (
            <Text testID="sign-in-error" style={styles.error}>
              {error}
            </Text>
          )}

          <PrimaryButton
            testID="sign-in-button"
            label="Se connecter"
            loading={isSubmitting}
            onPress={handleSubmit}
          />
        </View>

        <Link href="/sign-up" testID="go-to-sign-up" style={styles.link}>
          Pas encore de compte ?{" "}
          <Text style={styles.linkStrong}>Créer un compte</Text>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.xl,
  },
  header: {
    gap: spacing.xs,
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
  error: {
    ...typography.caption,
    fontSize: 14,
    color: colors.accent,
  },
  link: {
    ...typography.body,
    textAlign: "center",
    color: colors.textMuted,
  },
  linkStrong: {
    fontWeight: "700",
    color: colors.primary,
  },
});
