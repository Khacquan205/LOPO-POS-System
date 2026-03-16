import type { ProductItemViewModel } from '../features/products/store/products.store';

export type StockItem = {
  productId: string;
  quantity: number;
};

export type StockIssue = {
  type: 'out_of_stock' | 'over_stock';
  onHand: number;
  trackInventory: boolean;
};

function resolveProduct(productId: string, products: ProductItemViewModel[]) {
  return products.find((p) => p.id === productId);
}

export function getStockIssue(
  item: StockItem,
  products: ProductItemViewModel[],
): StockIssue | null {
  const product = resolveProduct(item.productId, products);
  const trackInventory = product?.trackInventory ?? false;
  const onHand = product?.onHand ?? 0;

  if (!product || !trackInventory || onHand <= 0) {
    return {
      type: 'out_of_stock',
      onHand,
      trackInventory,
    };
  }

  if (item.quantity > onHand) {
    return {
      type: 'over_stock',
      onHand,
      trackInventory,
    };
  }

  return null;
}

export function hasStockIssues(
  items: StockItem[],
  products: ProductItemViewModel[],
): boolean {
  return items.some((item) => getStockIssue(item, products));
}
