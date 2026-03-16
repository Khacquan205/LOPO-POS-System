import { create } from "zustand";
import type { StoreItem } from "../services/store.service";
import {
  getMyStores as apiGetMyStores,
  selectStore as apiSelectStore,
  createStore as apiCreateStore,
  updateStoreName as apiUpdateStoreName,
  deleteStore as apiDeleteStore,
} from "../services/store.service";
import { useAuthStore } from "../../../store/auth.store";

interface StoreState {
  stores: StoreItem[];
  isLoading: boolean;
  error: string | null;
  fetchMyStores: () => Promise<void>;
  selectStore: (storeId: string) => Promise<void>;
  createStore: (name: string) => Promise<boolean>;
  updateStoreName: (storeId: string, name: string) => Promise<boolean>;
  deleteStore: (storeId: string) => Promise<boolean>;
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

      set((state) => ({
        stores: state.stores.map((s) => ({
          ...s,
          is_active: s.store_id === result.store_id,
        })),
        isLoading: false,
      }));

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

  updateStoreName: async (storeId: string, name: string) => {
    const token = useAuthStore.getState().accessToken;
    if (!token) return false;

    set({ isLoading: true, error: null });
    try {
      const result = await apiUpdateStoreName(token, storeId, name);
      set((state) => ({
        stores: state.stores.map((s) =>
          s.store_id === storeId ? { ...s, name: result.name } : s,
        ),
        isLoading: false,
      }));
      // Cập nhật storeName trong auth store nếu đang active
      const { user, setAuth, accessToken, refreshToken } =
        useAuthStore.getState();
      if (user && user.storeId === storeId) {
        await setAuth({
          user: { ...user, storeName: result.name },
          accessToken: accessToken!,
          refreshToken: refreshToken ?? undefined,
        });
      }
      return true;
    } catch (err: any) {
      set({ error: err.message ?? "Lỗi đổi tên cửa hàng", isLoading: false });
      return false;
    }
  },

  deleteStore: async (storeId: string) => {
    const token = useAuthStore.getState().accessToken;
    if (!token) return false;

    set({ isLoading: true, error: null });
    try {
      await apiDeleteStore(token, storeId);
      // Reload danh sách stores từ server
      const stores = await apiGetMyStores(token);
      set({ stores, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message ?? "Lỗi xóa cửa hàng", isLoading: false });
      return false;
    }
  },
}));
