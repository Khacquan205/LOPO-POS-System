// ── Types ────────────────────────────────────────────────────
export interface ProductCategory {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  unit: string;
  icon: string; // Ionicons name
  color: string; // thumbnail background color
}

export interface PickedItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

// ── Categories ───────────────────────────────────────────────
export const categories: ProductCategory[] = [
  { id: 'all', name: 'Tất cả' },
  { id: 'banh-keo', name: 'Bánh kẹo' },
  { id: 'thuc-uong', name: 'Thức uống' },
  { id: 'van-phong-pham', name: 'Văn phòng phẩm' },
  { id: 've-sinh-ca-nhan', name: 'Vệ sinh cá nhân' },
  { id: 'gia-dung', name: 'Gia dụng' },
];

// ── Products ─────────────────────────────────────────────────
export const products: Product[] = [
  { id: 'p1', name: 'Bánh mì', price: 12000, categoryId: 'banh-keo', unit: 'cái', icon: 'fast-food-outline', color: '#FFF3CD' },
  { id: 'p2', name: "Snack khoai tây Lay's", price: 15000, categoryId: 'banh-keo', unit: 'gói', icon: 'pizza-outline', color: '#FFE0B2' },
  { id: 'p3', name: 'Bánh bông lan', price: 8000, categoryId: 'banh-keo', unit: 'cái', icon: 'cafe-outline', color: '#FCE4EC' },
  { id: 'p4', name: 'Kẹo Bibica', price: 22000, categoryId: 'banh-keo', unit: 'túi', icon: 'star-outline', color: '#E8F5E9' },
  { id: 'p5', name: 'Kem Merino', price: 23000, categoryId: 'banh-keo', unit: 'ly', icon: 'snow-outline', color: '#E3F2FD' },
  { id: 'p13', name: 'Bánh trung thu', price: 45000, categoryId: 'banh-keo', unit: 'cái', icon: 'moon-outline', color: '#FFF3E0' },
  { id: 'p6', name: 'Nước suối Lavie', price: 8000, categoryId: 'thuc-uong', unit: 'chai', icon: 'water-outline', color: '#E3F2FD' },
  { id: 'p7', name: 'Lon Coca Cola', price: 12000, categoryId: 'thuc-uong', unit: 'lon', icon: 'beer-outline', color: '#FFEBEE' },
  { id: 'p8', name: 'Lon 7up', price: 10000, categoryId: 'thuc-uong', unit: 'lon', icon: 'leaf-outline', color: '#E8F5E9' },
  { id: 'p9', name: 'Lon Revive', price: 10000, categoryId: 'thuc-uong', unit: 'lon', icon: 'fitness-outline', color: '#E0F7FA' },
  { id: 'p10', name: 'Bàn chải đánh răng', price: 25000, categoryId: 've-sinh-ca-nhan', unit: 'cái', icon: 'brush-outline', color: '#F3E5F5' },
  { id: 'p11', name: 'Kem đánh răng Colgate', price: 30000, categoryId: 've-sinh-ca-nhan', unit: 'tuýp', icon: 'body-outline', color: '#E0F2F1' },
  { id: 'p12', name: 'Nước rửa chén Sunlight', price: 20000, categoryId: 'gia-dung', unit: 'chai', icon: 'sparkles-outline', color: '#FFFDE7' },
];

// ── Helpers ──────────────────────────────────────────────────
export const getProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

export const getProductsByCategory = (categoryId: string): Product[] => {
  if (categoryId === 'all') return products;
  return products.filter((p) => p.categoryId === categoryId);
};

export const formatPrice = (price: number): string =>
  price.toLocaleString('vi-VN') + '₫';
