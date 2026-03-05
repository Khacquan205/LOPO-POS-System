// ── Product Types ────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

// ── Mock Data ────────────────────────────────────────────────
export const productsMock: Product[] = [
  { id: '1', name: 'Cà phê đen', sku: 'CF001', price: 25000, stock: 100, category: 'Đồ uống' },
  { id: '2', name: 'Cà phê sữa', sku: 'CF002', price: 30000, stock: 85, category: 'Đồ uống' },
  { id: '3', name: 'Trà đào', sku: 'TR001', price: 35000, stock: 50, category: 'Đồ uống' },
  { id: '4', name: 'Trà sữa trân châu', sku: 'TR002', price: 40000, stock: 45, category: 'Đồ uống' },
  { id: '5', name: 'Sinh tố bơ', sku: 'ST001', price: 45000, stock: 30, category: 'Đồ uống' },
  { id: '6', name: 'Bánh mì thịt', sku: 'BM001', price: 25000, stock: 20, category: 'Đồ ăn' },
  { id: '7', name: 'Bánh croissant', sku: 'BM002', price: 35000, stock: 15, category: 'Đồ ăn' },
  { id: '8', name: 'Sandwich gà', sku: 'SW001', price: 45000, stock: 12, category: 'Đồ ăn' },
  { id: '9', name: 'Nước suối', sku: 'NS001', price: 10000, stock: 200, category: 'Đồ uống' },
  { id: '10', name: 'Nước ngọt', sku: 'NN001', price: 15000, stock: 150, category: 'Đồ uống' },
];

// ── Helper ───────────────────────────────────────────────────
export const formatPrice = (price: number): string => {
  return price.toLocaleString('vi-VN') + '₫';
};
