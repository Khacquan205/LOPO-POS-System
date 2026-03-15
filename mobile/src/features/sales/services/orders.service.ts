import { apiRequest } from "../../../lib/api/client";

// ── Response shapes ──────────────────────────────────────────

export interface ApiOrderCashier {
  _id: string;
  full_name: string;
  phone_number: string;
  role: string;
}

export interface ApiOrder {
  order_id: string;
  store_id: string;
  order_code: string;
  cashier_user_id: ApiOrderCashier | string | null;
  customer_id: string | null;
  status: "draft" | "completed" | "cancelled";
  payment_method: string;
  payment_status: string;
  grand_total: number;
  completed_at: string | null;
  cancelled_at: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiOrderItem {
  order_id: string;
  product_id: string;
  product_name_snapshot: string;
  barcode_snapshot: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface OrderDetailResult {
  order: ApiOrder;
  items: ApiOrderItem[];
}

interface CreateOrderResponse {
  message: string;
  result: OrderDetailResult;
}

interface GetOrderResponse {
  message: string;
  result: OrderDetailResult;
}

interface UpdateItemsResponse {
  message: string;
  result: OrderDetailResult;
}

interface CheckoutResponse {
  message: string;
  result: OrderDetailResult;
}

interface CancelResponse {
  message: string;
  result: ApiOrder;
}

// ── Request payload shapes ───────────────────────────────────

export interface OrderItemPayload {
  product_id: string;
  quantity: number;
}

export interface CheckoutPayload {
  payment_method: string;
  payment_status: string;
}

// ── API Functions ────────────────────────────────────────────

/** POST /orders — Tạo đơn nháp mới */
export async function createDraftOrder(
  token: string,
): Promise<OrderDetailResult> {
  const res = await apiRequest<CreateOrderResponse>("/orders", {
    method: "POST",
    token,
  });
  return res.result;
}

/** GET /orders/:id — Lấy chi tiết đơn hàng */
export async function getOrderDetail(
  token: string,
  orderId: string,
): Promise<OrderDetailResult> {
  const res = await apiRequest<GetOrderResponse>(`/orders/${orderId}`, {
    token,
  });
  return res.result;
}

/** PUT /orders/:id/items — Thay thế toàn bộ items của đơn nháp */
export async function updateOrderItems(
  token: string,
  orderId: string,
  items: OrderItemPayload[],
): Promise<OrderDetailResult> {
  const res = await apiRequest<UpdateItemsResponse>(
    `/orders/${orderId}/items`,
    {
      method: "PUT",
      token,
      body: JSON.stringify({ items }),
    },
  );
  return res.result;
}

/** POST /orders/:id/checkout — Thanh toán đơn nháp → completed */
export async function checkoutOrder(
  token: string,
  orderId: string,
  payload: CheckoutPayload,
): Promise<OrderDetailResult> {
  const res = await apiRequest<CheckoutResponse>(
    `/orders/${orderId}/checkout`,
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    },
  );
  return res.result;
}

/** PATCH /orders/:id/cancel — Hủy đơn nháp */
export async function cancelDraftOrder(
  token: string,
  orderId: string,
): Promise<ApiOrder> {
  const res = await apiRequest<CancelResponse>(`/orders/${orderId}/cancel`, {
    method: "PATCH",
    token,
  });
  return res.result;
}

interface GetOrdersResponse {
  message: string;
  result: ApiOrder[];
}

/** GET /orders — Danh sách tất cả đơn hàng của cửa hàng */
export async function getOrders(token: string): Promise<ApiOrder[]> {
  const res = await apiRequest<GetOrdersResponse>("/orders", { token });
  return res.result;
}
