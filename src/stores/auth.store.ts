import { create } from "zustand";
import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "../config/firebase";

type SigInOptions = {
  email: string;
  password: string;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  signIn: (options: SigInOptions) => void;
  signOut: () => void;
};

const useAuthStore = create<AuthState>()(() => ({
  user: null,
  isLoading: true,
  signIn: ({ email, password }: SigInOptions) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("User signed in!");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-credential") {
          console.log("Wrong email or password!");
        }
        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }
        if (error.code === "auth/user-disabled") {
          console.log("This account has been disabled!");
        }
        console.error(error);
      });
  },
  signOut: () => {
    signOut(auth).then(() => console.log("User signed out!"));
  },
}));

// Firebase appelle ce callback au démarrage (session restaurée ou non),
// puis à chaque connexion / déconnexion.
onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, isLoading: false });
});

export default useAuthStore;
