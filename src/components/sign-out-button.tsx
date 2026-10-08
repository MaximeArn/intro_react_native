import { Alert } from "react-native";

import DestructiveButton from "@/components/destructive-button";
import useAuthStore from "@/stores/auth.store";

export default function SignOutButton() {
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <DestructiveButton
      testID="sign-out-button"
      label="Se déconnecter"
      icon="logout"
      onPress={() =>
        signOut().catch(() =>
          Alert.alert("Déconnexion impossible", "Réessaie dans un instant."),
        )
      }
    />
  );
}
