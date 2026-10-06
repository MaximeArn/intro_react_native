import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";

export const auth = getAuth();
export const db = getFirestore();

export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "@react-native-firebase/auth";
export { addDoc, collection, getDocs } from "@react-native-firebase/firestore";
