import { create } from "zustand";
import {
  getInventoryStockByProduct,
  getInventoryStocks,
  updateInventoryStock as updateInventoryStockApi,
} from "../services/inventory.service";

interface InventoryState {
  stockByProductId: Record<string, number>;
  fetchAllStocks: (token: string) => Promise<void>;
  fetchStockByProduct: (
    token: string,
    productId: string,
  ) => Promise<number | null>;
  updateStock: (
    token: string,
    productId: string,
    onHand: number,
  ) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  stockByProductId: {},

  fetchAllStocks: async (token) => {
    const stocks = await getInventoryStocks(token);
    const stockMap: Record<string, number> = {};

    stocks.forEach((item) => {
      const productId =
        typeof item.product_id === "string"
          ? item.product_id
          : item.product_id?._id;
      if (productId) {
        stockMap[productId] = item.on_hand;
      }
    });

    set({ stockByProductId: stockMap });
  },

  fetchStockByProduct: async (token, productId) => {
    try {
      const stock = await getInventoryStockByProduct(token, productId);
      set((state) => ({
        stockByProductId: {
          ...state.stockByProductId,
          [productId]: stock.on_hand,
        },
      }));
      return stock.on_hand;
    } catch {
      // 404 means chưa có bản ghi tồn kho cho sản phẩm này.
      set((state) => ({
        stockByProductId: {
          ...state.stockByProductId,
          [productId]: 0,
        },
      }));
      return null;
    }
  },

  updateStock: async (token, productId, onHand) => {
    const normalized =
      Number.isFinite(onHand) && onHand > 0 ? Math.floor(onHand) : 0;
    const stock = await updateInventoryStockApi(token, productId, {
      on_hand: normalized,
    });

    set((state) => ({
      stockByProductId: {
        ...state.stockByProductId,
        [productId]: stock.on_hand,
      },
    }));

    await get().fetchAllStocks(token);
  },
}));
