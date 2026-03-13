import { apiRequest } from "../../../lib/api/client";

export interface ApiProduct {
  _id?: string;
  product_id?: string;
  store_id: string;
  category_id: string | null;
  name: string;
  sku?: string;
  cost_price?: number;
  barcode: string | null;
  price: number;
  image_url: string | null;
  track_inventory: boolean;
  is_active: boolean;
  on_hand?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface GetProductsResponse {
  message: string;
  result: ApiProduct[];
}

interface ProductResponse {
  message: string;
  result: ApiProduct;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  category_id?: string | null;
  barcode?: string;
  image_url?: string;
  track_inventory?: boolean;
  on_hand?: number;
  is_active?: boolean;
}

export interface UpdateProductPayload {
  name?: string;
  price?: number;
  category_id?: string | null;
  barcode?: string;
  image_url?: string;
  track_inventory?: boolean;
  on_hand?: number;
  is_active?: boolean;
}

export async function getProducts(token: string): Promise<ApiProduct[]> {
  const response = await apiRequest<GetProductsResponse>("/products", {
    token,
  });
  return response.result;
}

export async function getProductById(
  token: string,
  productId: string,
): Promise<ApiProduct> {
  const response = await apiRequest<ProductResponse>(`/products/${productId}`, {
    token,
  });
  return response.result;
}

export async function createProduct(
  token: string,
  payload: CreateProductPayload,
): Promise<ApiProduct> {
  const response = await apiRequest<ProductResponse>("/products", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
  return response.result;
}

export async function updateProduct(
  token: string,
  productId: string,
  payload: UpdateProductPayload,
): Promise<ApiProduct> {
  const response = await apiRequest<ProductResponse>(`/products/${productId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
  return response.result;
}

export async function deleteProduct(
  token: string,
  productId: string,
): Promise<void> {
  await apiRequest<{ message: string }>(`/products/${productId}`, {
    method: "DELETE",
    token,
  });
}
