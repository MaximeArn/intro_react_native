import { create } from "zustand";
// import zustandStorage from "../data/mmkvAdapter";

type ShoppingState = {
  itemIds: Array<string>;
};

type Actions = {
  addItem: (itemId: string) => void;
  removeItem: (itemId: string) => void;
};

const useShoppingStore = create<ShoppingState & Actions>()(
  // persist(
  (set) => ({
    itemIds: [],
    addItem(itemId: string) {
      set((state) => ({
        itemIds: [...state.itemIds, itemId],
      }));
    },
    removeItem(itemId: string) {
      set((state) => ({
        itemIds: state.itemIds.filter((stateItemId) => stateItemId !== itemId),
      }));
    },
  }),
  //   {
  //     name: "shopping-list",
  //     storage: createJSONStorage(() => zustandStorage),
  //   },
  // ),
);

export default useShoppingStore;
