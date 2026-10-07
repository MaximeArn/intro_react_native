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

const PASSWORD_MIN_LENGTH = 6;

export default function SignUp() {
  const { signUp } = useAuthStore();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!displayName.trim() || !email.trim() || !password) {
      return "Tous les champs sont obligatoires.";
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      return `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.`;
    }
    if (password !== passwordConfirm) {
      return "Les mots de passe ne correspondent pas.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    setError(validationError);
    if (validationError) return;

    setIsSubmitting(true);
    try {
      await signUp({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
      });
    } catch (e) {
      setError(getErrorMessage(e, "Impossible de créer le compte, réessaie."));
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
      >
        <View style={styles.header}>
          <MapPinAnimation />
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>
            Enregistre et partage tes bonnes adresses.
          </Text>
        </View>

        <View style={styles.form}>
          <FormInput
            testID="sign-up-display-name-input"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Pseudo"
            autoCapitalize="words"
            autoComplete="nickname"
          />
          <FormInput
            testID="sign-up-email-input"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <FormInput
            testID="sign-up-password-input"
            value={password}
            onChangeText={setPassword}
            placeholder="Mot de passe"
            secureTextEntry
            autoComplete="new-password"
          />
          <FormInput
            testID="sign-up-password-confirm-input"
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            placeholder="Confirmer le mot de passe"
            secureTextEntry
            autoComplete="new-password"
          />

          {error && (
            <Text testID="sign-up-error" style={styles.error}>
              {error}
            </Text>
          )}

          <PrimaryButton
            testID="sign-up-button"
            label="Créer mon compte"
            loading={isSubmitting}
            onPress={handleSubmit}
          />
        </View>

        {/* dismissTo : revient à l'écran de connexion au lieu d'en empiler un nouveau */}
        <Link
          href="/sign-in"
          dismissTo
          testID="go-to-sign-in"
          style={styles.link}
        >
          Déjà un compte ? <Text style={styles.linkStrong}>Se connecter</Text>
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
  title: {
    ...typography.title,
    color: colors.primary,
  },
  subtitle: {
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
