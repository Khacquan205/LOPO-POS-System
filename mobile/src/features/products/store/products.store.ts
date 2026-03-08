import { create } from "zustand";
import {
  categoriesMock,
  productsMock,
  type Product,
} from "../mock/productManagement.mock";

interface AddProductInput {
  name: string;
  price: number;
  category: string;
}

interface ProductsState {
  products: Product[];
  addProduct: (input: AddProductInput) => void;
  updateProduct: (productId: string, input: AddProductInput) => void;
  setProductStatus: (productId: string, status: "active" | "inactive") => void;
  removeProducts: (ids: string[]) => void;
}

const getCategoryColor = (categoryName: string): string => {
  return (
    categoriesMock.find((category) => category.name === categoryName)?.color ??
    categoriesMock[0].color
  );
};

export const useProductsStore = create<ProductsState>((set) => ({
  products: productsMock,
  addProduct: ({ name, price, category }) => {
    const trimmedName = name.trim();
    const normalizedCategory = category.trim() || categoriesMock[0].name;

    if (!trimmedName) return;

    set((state) => ({
      products: [
        {
          id: Date.now().toString(),
          name: trimmedName,
          price: price > 0 ? price : 0,
          category: normalizedCategory,
          categoryColor: getCategoryColor(normalizedCategory),
          status: "active",
        },
        ...state.products,
      ],
    }));
  },
  updateProduct: (productId, { name, price, category }) => {
    const trimmedName = name.trim();
    const normalizedCategory = category.trim() || categoriesMock[0].name;

    if (!trimmedName) return;

    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId
          ? {
              ...product,
              name: trimmedName,
              price: price > 0 ? price : 0,
              category: normalizedCategory,
              categoryColor: getCategoryColor(normalizedCategory),
            }
          : product,
      ),
    }));
  },
  setProductStatus: (productId, status) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId
          ? {
              ...product,
              status,
            }
          : product,
      ),
    }));
  },
  removeProducts: (ids) => {
    if (ids.length === 0) return;
    set((state) => ({
      products: state.products.filter((product) => !ids.includes(product.id)),
    }));
  },
}));
