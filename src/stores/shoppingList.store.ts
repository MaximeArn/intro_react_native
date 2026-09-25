import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import zustandStorage from "../data/mmkvAdapter";

type ShoppingState = {
  itemIds: Array<number>;
};

type Actions = {
  addItem: (itemId: number) => void;
  removeItem: (itemId: number) => void;
};

const useShoppingStore = create<ShoppingState & Actions>()(
  persist(
    (set) => ({
      itemIds: [],
      addItem(itemId: number) {
        set((state) => ({
          itemIds: [...state.itemIds, itemId],
        }));
      },
      removeItem(itemId: number) {
        set((state) => ({
          itemIds: state.itemIds.filter(
            (stateItemId) => stateItemId !== itemId,
          ),
        }));
      },
    }),
    {
      name: "shopping-list",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

export default useShoppingStore;
