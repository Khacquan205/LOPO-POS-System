export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  categoryColor: string;
  image?: string;
}

export interface CategoryChipData {
  id: string;
  name: string;
  color: string;
}
