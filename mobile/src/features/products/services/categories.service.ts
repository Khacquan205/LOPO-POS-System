import { apiRequest } from "../../../lib/api/client";

// ── Response shapes ────────────────────────────────────────────────────────

export interface ApiCategory {
  category_id: string;
  name: string;
  is_active: boolean;
  store_id: string;
}

interface GetCategoriesResponse {
  message: string;
  result: ApiCategory[];
}

interface CategoryResponse {
  message: string;
  result: ApiCategory;
}

// ── Colour palette – assigned by index ────────────────────────────────────

const CATEGORY_COLORS = [
  "#FFA500",
  "#20B2AA",
  "#228B22",
  "#DA70D6",
  "#FF6B9D",
  "#4A90D9",
  "#E74C3C",
  "#F39C12",
  "#8E44AD",
  "#16A085",
];

export function getCategoryColor(index: number): string {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}

// ── API call ──────────────────────────────────────────────────────────────

export async function getCategories(token: string): Promise<ApiCategory[]> {
  const response = await apiRequest<GetCategoriesResponse>("/categories", {
    token,
  });
  return response.result;
}

export async function createCategory(
  token: string,
  payload: { name: string; is_active?: boolean },
): Promise<ApiCategory> {
  const response = await apiRequest<CategoryResponse>("/categories", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
  return response.result;
}

export async function updateCategory(
  token: string,
  categoryId: string,
  payload: { name?: string; is_active?: boolean },
): Promise<ApiCategory> {
  const response = await apiRequest<CategoryResponse>(
    `/categories/${categoryId}`,
    {
      method: "PUT",
      token,
      body: JSON.stringify(payload),
    },
  );
  return response.result;
}

export async function deleteCategory(
  token: string,
  categoryId: string,
): Promise<void> {
  await apiRequest<{ message: string }>(`/categories/${categoryId}`, {
    method: "DELETE",
    token,
  });
}
