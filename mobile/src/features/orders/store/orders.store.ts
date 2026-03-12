import { create } from 'zustand';
import { getOrders, type ApiOrder } from '../../sales/services/orders.service';

interface OrdersState {
  orders: ApiOrder[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: (token: string) => Promise<void>;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,
  fetchOrders: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await getOrders(token);
      set({ orders, isLoading: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể tải danh sách đơn hàng';
      set({ isLoading: false, error: msg });
    }
  },
}));
