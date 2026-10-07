import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";
import { getStorage } from "@react-native-firebase/storage";

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

export {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "@react-native-firebase/auth";
export { addDoc, collection, getDocs } from "@react-native-firebase/firestore";
export {
  deleteObject,
  getDownloadURL,
  putFile,
  ref,
} from "@react-native-firebase/storage";
