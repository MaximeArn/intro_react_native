import { StyleSheet, Text, View } from "react-native";

import SignOutButton from "@/components/sign-out-button";
import {
  colors,
  radius,
  shadow,
  spacing,
  typography,
} from "@/constants/theme";
import useAuthStore from "@/stores/auth.store";

export default function Account() {
  const user = useAuthStore((state) => state.user);
  const email = user?.email ?? "";

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{email.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>Connecté avec</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

      <SignOutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.lg,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  label: {
    ...typography.overline,
  },
  email: {
    ...typography.heading,
  },
});
