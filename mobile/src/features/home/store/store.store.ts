import { create } from "zustand";
import type { StoreItem } from "../services/store.service";
import {
  getMyStores as apiGetMyStores,
  selectStore as apiSelectStore,
  createStore as apiCreateStore,
} from "../services/store.service";
import { useAuthStore } from "../../../store/auth.store";

interface StoreState {
  stores: StoreItem[];
  isLoading: boolean;
  error: string | null;
  fetchMyStores: () => Promise<void>;
  selectStore: (storeId: string) => Promise<void>;
  createStore: (name: string) => Promise<boolean>;
}

export const useStoreStore = create<StoreState>((set, get) => ({
  stores: [],
  isLoading: false,
  error: null,

  fetchMyStores: async () => {
    const token = useAuthStore.getState().accessToken;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const stores = await apiGetMyStores(token);
      set({ stores, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message ?? "Lỗi tải danh sách cửa hàng",
        isLoading: false,
      });
    }
  },

  selectStore: async (storeId: string) => {
    const token = useAuthStore.getState().accessToken;
    if (!token) return;

    set({ isLoading: true, error: null });
    try {
      const result = await apiSelectStore(token, storeId);

      // Update is_active flags locally
      set((state) => ({
        stores: state.stores.map((s) => ({
          ...s,
          is_active: s.store_id === result.store_id,
        })),
        isLoading: false,
      }));

      // Update user info in auth store
      const { user, setAuth, accessToken, refreshToken } =
        useAuthStore.getState();
      if (user) {
        await setAuth({
          user: { ...user, storeId: result.store_id, storeName: result.name },
          accessToken: accessToken!,
          refreshToken: refreshToken ?? undefined,
        });
      }
    } catch (err: any) {
      set({ error: err.message ?? "Lỗi chọn cửa hàng", isLoading: false });
    }
  },

  createStore: async (name: string) => {
    const token = useAuthStore.getState().accessToken;
    if (!token) return false;

    set({ isLoading: true, error: null });
    try {
      await apiCreateStore(token, name);
      const stores = await apiGetMyStores(token);
      set({ stores, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message ?? "Lỗi tạo cửa hàng", isLoading: false });
      return false;
    }
  },
}));
