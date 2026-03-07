// ============================================================================
// PRODUCT MANAGEMENT MOCK DATA
// ============================================================================

// Types
export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  categoryColor: string;
  image?: string;
}

// ============================================================================
// CATEGORIES MOCK DATA
// ============================================================================

export const categoriesMock: Category[] = [
  { id: "1", name: "Bánh kẹo", color: "#FFA500" },
  { id: "2", name: "Thức uống", color: "#20B2AA" },
  { id: "3", name: "Văn phòng phẩm", color: "#228B22" },
  { id: "4", name: "Vệ sinh cá nhân", color: "#DA70D6" },
  { id: "5", name: "Kẹo cao su", color: "#FF6B9D" },
];

// ============================================================================
// PRODUCTS MOCK DATA
// ============================================================================

export const productsMock: Product[] = [
  {
    id: "1",
    name: "Bánh mì",
    price: 4000,
    category: "Bánh kẹo",
    categoryColor: "#FFA500",
  },
  {
    id: "2",
    name: "Bánh bông lan",
    price: 4000,
    category: "Bánh kẹo",
    categoryColor: "#FFA500",
  },
  {
    id: "3",
    name: "Nước suối Lavie",
    price: 4000,
    category: "Thức uống",
    categoryColor: "#20B2AA",
  },
  {
    id: "4",
    name: "Lon Coca Cola",
    price: 4000,
    category: "Thức uống",
    categoryColor: "#20B2AA",
  },
  {
    id: "5",
    name: "Lon 7up",
    price: 4000,
    category: "Thức uống",
    categoryColor: "#20B2AA",
  },
  {
    id: "6",
    name: "Bàn chải đánh răng",
    price: 4000,
    category: "Vệ sinh cá nhân",
    categoryColor: "#DA70D6",
  },
  {
    id: "7",
    name: "Kem đánh răng",
    price: 4000,
    category: "Vệ sinh cá nhân",
    categoryColor: "#DA70D6",
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format price to Vietnamese currency format with ₫ symbol
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
};
