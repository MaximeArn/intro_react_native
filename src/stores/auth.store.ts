import { create } from "zustand";

import {
  auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "@/services/firebase";
import { deleteImage, uploadImage } from "@/services/storage";

type SigInOptions = {
  email: string;
  password: string;
};

type SignUpOptions = SigInOptions & {
  displayName: string;
};

// Les actions asynchrones rejettent avec l'erreur Firebase :
// l'écran appelant la traduit avec getErrorMessage et l'affiche
type AuthState = {
  user: User | null;
  isLoading: boolean;
  signIn: (options: SigInOptions) => Promise<void>;
  signUp: (options: SignUpOptions) => Promise<void>;
  updatePhoto: (localUri: string) => Promise<void>;
  removePhoto: () => Promise<void>;
  signOut: () => Promise<void>;
};

// L'ancienne photo n'est plus référencée : un échec de suppression laisse
// seulement un fichier orphelin, il ne doit pas faire échouer la mise à jour
const deletePreviousPhoto = (url: string | null) => {
  if (url) deleteImage(url).catch(() => {});
};

const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: true,
  signIn: async ({ email, password }: SigInOptions) => {
    await signInWithEmailAndPassword(auth, email, password);
  },
  signUp: async ({ displayName, email, password }: SignUpOptions) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await updateProfile(user, { displayName });
    set({ user: auth.currentUser });
  },
  updatePhoto: async (localUri: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const previousUrl = user.photoURL;
    const photoURL = await uploadImage(
      localUri,
      `users/${user.uid}/avatar-${Date.now()}.jpg`,
    );
    await updateProfile(user, { photoURL });
    set({ user: auth.currentUser });
    deletePreviousPhoto(previousUrl);
  },
  removePhoto: async () => {
    const user = auth.currentUser;
    if (!user?.photoURL) return;

    const previousUrl = user.photoURL;
    await updateProfile(user, { photoURL: null });
    set({ user: auth.currentUser });
    deletePreviousPhoto(previousUrl);
  },
  signOut: async () => {
    await signOut(auth);
  },
}));

// Firebase appelle ce callback au démarrage (session restaurée ou non),
// puis à chaque connexion / déconnexion.
onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, isLoading: false });
});

export default useAuthStore;
