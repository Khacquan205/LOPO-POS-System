import { create } from "zustand";
import {
  createCategory as createCategoryApi,
  deleteCategory as deleteCategoryApi,
  getCategories,
  getCategoryColor,
  updateCategory as updateCategoryApi,
} from "../services/categories.service";

export interface ProductCategory {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

interface CategoriesState {
  categories: ProductCategory[];
  fetchCategories: (token: string) => Promise<void>;
  createCategory: (
    token: string,
    payload: { name: string; is_active?: boolean },
  ) => Promise<void>;
  updateCategory: (
    token: string,
    categoryId: string,
    payload: { name?: string; is_active?: boolean },
  ) => Promise<void>;
  deleteCategory: (token: string, categoryId: string) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  fetchCategories: async (token) => {
    const items = await getCategories(token);
    set({
      categories: items.map((item, index) => ({
        id: item.category_id,
        name: item.name,
        color: getCategoryColor(index),
        isActive: item.is_active,
      })),
    });
  },
  createCategory: async (token, payload) => {
    await createCategoryApi(token, payload);
    await get().fetchCategories(token);
  },
  updateCategory: async (token, categoryId, payload) => {
    await updateCategoryApi(token, categoryId, payload);
    await get().fetchCategories(token);
  },
  deleteCategory: async (token, categoryId) => {
    await deleteCategoryApi(token, categoryId);
    await get().fetchCategories(token);
  },
}));
