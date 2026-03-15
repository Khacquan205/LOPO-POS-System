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
