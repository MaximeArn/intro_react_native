import { create } from "zustand";

import { subscribeToVisibleAddresses } from "@/services/addresses";
import type { Address } from "@/types/address";
import { getErrorMessage } from "@/utils/error-messages";

type AddressesState = {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  subscribe: (userId: string) => () => void;
};

const useAddressesStore = create<AddressesState>()((set) => ({
  addresses: [],
  isLoading: true,
  error: null,
  subscribe: (userId) => {
    set({ isLoading: true, error: null });
    const unsubscribe = subscribeToVisibleAddresses(
      userId,
      (addresses) => set({ addresses, isLoading: false, error: null }),
      (error) =>
        set({
          isLoading: false,
          error: getErrorMessage(error, "Impossible de charger les adresses."),
        }),
    );
    return () => {
      unsubscribe();
      set({ addresses: [], isLoading: true, error: null });
    };
  },
}));

export default useAddressesStore;
