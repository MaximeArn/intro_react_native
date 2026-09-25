import { addDoc, collection, getDocs } from "@react-native-firebase/firestore";
import { create } from "zustand";
import db from "../config/firebase/firestore";
import { Ingredient } from "../types/ingredient";

type IngredientsState = {
  ingredients: Array<Ingredient>;
  isLoading: boolean;
};

type Actions = {
  fetchIngredients: () => Promise<void>;
  addItem: (ingredient: Omit<Ingredient, "id">) => Promise<void>;
};

const ingredientsCollection = collection(db, "ingredients");

const useIngredientsStore = create<IngredientsState & Actions>()(
  (set, get) => ({
    ingredients: [],
    isLoading: true,
    fetchIngredients: async () => {
      try {
        const { docs } = await getDocs(ingredientsCollection);
        const ingredients = docs.map((doc) => ({
          ...(doc.data() as Omit<Ingredient, "id">),
          id: doc.id,
        }));
        set({ ingredients });
      } catch (error) {
        console.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
    addItem: async (ingredient) => {
      await addDoc(ingredientsCollection, ingredient);
      await get().fetchIngredients();
    },
  }),
);

export default useIngredientsStore;
