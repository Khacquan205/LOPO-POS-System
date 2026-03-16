import { apiRequest } from "../../../lib/api/client";

// ── Response shapes ──────────────────────────────────────────

export interface StoreItem {
  store_id: string;
  name: string;
  store_qr_code?: string;
  role: "owner" | "staff" | null;
  joined_at: string | null;
  is_active: boolean;
}

interface GetMyStoresResponse {
  message: string;
  result: StoreItem[];
}

interface SelectStoreResponse {
  message: string;
  result: {
    store_id: string;
    name: string;
    role: string;
  };
}

interface CreateStoreResponse {
  message: string;
  result: {
    store_id: string;
    name: string;
    store_qr_code?: string;
    role: "owner" | "staff" | null;
  };
}

// ── API calls ────────────────────────────────────────────────

export async function getMyStores(token: string): Promise<StoreItem[]> {
  const data = await apiRequest<GetMyStoresResponse>("/stores/my-stores", {
    method: "GET",
    token,
  });
  return data.result;
}

export async function selectStore(
  token: string,
  storeId: string,
): Promise<SelectStoreResponse["result"]> {
  const data = await apiRequest<SelectStoreResponse>("/stores/select", {
    method: "POST",
    token,
    body: JSON.stringify({ store_id: storeId }),
  });
  return data.result;
}

export async function createStore(
  token: string,
  name: string,
): Promise<CreateStoreResponse["result"]> {
  const data = await apiRequest<CreateStoreResponse>("/stores", {
    method: "POST",
    token,
    body: JSON.stringify({ name }),
  });
  return data.result;
}

interface UpdateStoreNameResponse {
  message: string;
  result: {
    store_id: string;
    name: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
  };
}

/** PATCH /users/owner/stores/:store_id — đổi tên cửa hàng */
export async function updateStoreName(
  token: string,
  storeId: string,
  name: string,
): Promise<UpdateStoreNameResponse["result"]> {
  const data = await apiRequest<UpdateStoreNameResponse>(
    `/users/owner/stores/${storeId}`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify({ name }),
    },
  );
  return data.result;
}

interface DeleteStoreResponse {
  message: string;
  result: {
    deleted_store_id: string;
    new_active_store_id?: string | null;
  };
}

/** DELETE /users/owner/stores/:store_id — xóa cửa hàng */
export async function deleteStore(
  token: string,
  storeId: string,
): Promise<DeleteStoreResponse["result"]> {
  const data = await apiRequest<DeleteStoreResponse>(
    `/users/owner/stores/${storeId}`,
    {
      method: "DELETE",
      token,
    },
  );
  return data.result;
}
