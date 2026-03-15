import { create } from "zustand";
import {
  createProduct as createProductApi,
  deleteProduct as deleteProductApi,
  getProductById,
  getProducts,
  updateProduct as updateProductApi,
  type ApiProduct,
  type CreateProductPayload,
  type UpdateProductPayload,
} from "../services/products.service";
import { useInventoryStore } from "./inventory.store";

export interface CategoryLookup {
  id: string;
  name: string;
  color: string;
}

export interface ProductItemViewModel {
  id: string; 
  name: string;
  price: number;
  barcode: string | null;
  categoryId: string | null;
  category: string;
  categoryColor: string;
  onHand: number;
  trackInventory: boolean;
  status: "active" | "inactive";
  image?: string;
}

interface ProductsState {
  products: ProductItemViewModel[];
  fetchProducts: (
    token: string,
    categories?: CategoryLookup[],
  ) => Promise<void>;
  fetchProductById: (
    token: string,
    productId: string,
    categories?: CategoryLookup[],
  ) => Promise<ProductItemViewModel | null>;
  createProduct: (
    token: string,
    payload: CreateProductPayload,
    categories?: CategoryLookup[],
  ) => Promise<string>;
  updateProduct: (
    token: string,
    productId: string,
    payload: UpdateProductPayload,
    categories?: CategoryLookup[],
  ) => Promise<void>;
  setProductStatus: (
    token: string,
    productId: string,
    status: "active" | "inactive",
    categories?: CategoryLookup[],
  ) => Promise<void>;
  deleteProduct: (
    token: string,
    productId: string,
    categories?: CategoryLookup[],
  ) => Promise<void>;
  removeProducts: (
    token: string,
    ids: string[],
    categories?: CategoryLookup[],
  ) => Promise<void>;
}

const FALLBACK_COLOR = "#EFA442";
const UNCLASSIFIED = "Chua phan loai";

function resolveProductId(item: { _id?: string; product_id?: string }): string {
  return item._id ?? item.product_id ?? "";
}

function resolveOnHand(
  item: ApiProduct,
  stockByProductId: Record<string, number>,
): number {
  const productId = resolveProductId(item);
  if (productId && typeof stockByProductId[productId] === "number") {
    return stockByProductId[productId];
  }
  return typeof item.on_hand === "number" ? item.on_hand : 0;
}

function resolveCategory(
  categoryId: string | null,
  categories: CategoryLookup[],
): { name: string; color: string } {
  if (!categoryId) {
    return { name: UNCLASSIFIED, color: FALLBACK_COLOR };
  }

  const matched = categories.find((item) => item.id === categoryId);
  if (!matched) {
    return { name: UNCLASSIFIED, color: FALLBACK_COLOR };
  }

  return { name: matched.name, color: matched.color };
}

function mapApiProductToViewModel(
  item: ApiProduct,
  categories: CategoryLookup[],
  stockByProductId: Record<string, number>,
): ProductItemViewModel | null {
  const normalizedId = resolveProductId(item);
  if (!normalizedId) return null;

  const category = resolveCategory(item.category_id, categories);
  return {
    id: normalizedId,
    name: item.name,
    price: item.price,
    barcode: item.barcode ?? null,
    categoryId: item.category_id,
    category: category.name,
    categoryColor: category.color,
    onHand: resolveOnHand(item, stockByProductId),
    trackInventory: item.track_inventory,
    status: item.is_active ? "active" : "inactive",
    image: item.image_url ?? undefined,
  };
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],

  fetchProducts: async (token, categories = []) => {
    await useInventoryStore.getState().fetchAllStocks(token);
    const stockByProductId = useInventoryStore.getState().stockByProductId;
    const items = await getProducts(token);
    set({
      products: items
        .map((item) => mapApiProductToViewModel(item, categories, stockByProductId))
        .filter((item): item is ProductItemViewModel => item !== null),
    });
  },

  fetchProductById: async (token, productId, categories = []) => {
    const item = await getProductById(token, productId);
    await useInventoryStore.getState().fetchStockByProduct(token, productId);
    const stockByProductId = useInventoryStore.getState().stockByProductId;
    const mapped = mapApiProductToViewModel(item, categories, stockByProductId);
    if (!mapped) return null;

    set((state) => ({
      products: state.products.some((p) => p.id === mapped.id)
        ? state.products.map((p) => (p.id === mapped.id ? mapped : p))
        : [mapped, ...state.products],
    }));

    return mapped;
  },

  createProduct: async (token, payload, categories = []) => {
    const created = await createProductApi(token, payload);
    await get().fetchProducts(token, categories);
    return resolveProductId(created);
  },

  updateProduct: async (token, productId, payload, categories = []) => {
    await updateProductApi(token, productId, payload);
    await get().fetchProducts(token, categories);
  },

  setProductStatus: async (token, productId, status, categories = []) => {
    await updateProductApi(token, productId, {
      is_active: status === "active",
    });
    await get().fetchProducts(token, categories);
  },

  deleteProduct: async (token, productId, categories = []) => {
    await deleteProductApi(token, productId);
    await get().fetchProducts(token, categories);
  },

  removeProducts: async (token, ids, categories = []) => {
    if (ids.length === 0) return;
    await Promise.all(ids.map((id) => deleteProductApi(token, id)));
    await get().fetchProducts(token, categories);
  },
}));
