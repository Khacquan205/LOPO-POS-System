import { apiRequest } from "../../../lib/api/client";

interface ApiProductLite {
  _id: string;
  category_id: string | null;
  name: string;
  barcode: string | null;
  price: number;
  is_active: boolean;
}

export interface ApiInventoryStock {
  _id: string;
  store_id: string;
  product_id: string | ApiProductLite;
  inventory_stock_id: string;
  on_hand: number;
  createdAt: string;
  updatedAt: string;
}

interface StocksResponse {
  message: string;
  result: ApiInventoryStock[];
}

interface StockResponse {
  message: string;
  result: ApiInventoryStock;
}

export async function getInventoryStocks(
  token: string,
): Promise<ApiInventoryStock[]> {
  const response = await apiRequest<StocksResponse>("/inventory-stocks", {
    token,
  });
  return response.result;
}

export async function getInventoryStockByProduct(
  token: string,
  productId: string,
): Promise<ApiInventoryStock> {
  const response = await apiRequest<StockResponse>(
    `/inventory-stocks/${productId}`,
    {
      token,
    },
  );
  return response.result;
}

export async function updateInventoryStock(
  token: string,
  productId: string,
  payload: { on_hand: number },
): Promise<ApiInventoryStock> {
  const response = await apiRequest<StockResponse>(
    `/inventory-stocks/${productId}`,
    {
      method: "PUT",
      token,
      body: JSON.stringify(payload),
    },
  );
  return response.result;
}
