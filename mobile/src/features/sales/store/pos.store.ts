import { create } from "zustand";
import {
  createDraftOrder,
  getOrderDetail,
  updateOrderItems,
  checkoutOrder,
  cancelDraftOrder,
  type CheckoutPayload,
  type ApiOrderItem,
} from "../services/orders.service";
import { ApiError } from "../../../lib/api/client";

// ── Cart item (mirrors PickedItem + itemId for list key) ─────

export interface PosCartItem {
  /** Unique key in this session: "si_<product_id>" */
  itemId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

// ── Store shape ──────────────────────────────────────────────

interface PosState {
  orderId: string | null;
  orderCode: string | null;
  items: PosCartItem[];
  grandTotal: number;
  isCreatingOrder: boolean;
  isUpdatingItems: boolean;
  isCheckingOut: boolean;
  isCancelling: boolean;
  error: string | null;

  // Actions
  /**
   * Ensure a draft order exists. Creates one via API if `orderId` is null.
   * Returns the active orderId.
   */
  ensureDraftOrder: (token: string) => Promise<string | null>;

  /**
   * Merge pickedItems into the cart, then sync to backend.
   * Creates a draft order first if none exists.
   */
  addPickedItems: (
    token: string,
    picked: Array<{
      productId: string;
      productName: string;
      unitPrice: number;
      quantity: number;
      trackInventory: boolean;
      onHand: number;
    }>,
  ) => Promise<void>;

  /** Increment an item's quantity by 1, sync to backend */
  incrementItem: (
    token: string,
    productId: string,
    onHand: number,
    trackInventory: boolean,
  ) => Promise<void>;

  /** Decrement an item's quantity by 1 (removes if hits 0), sync to backend */
  decrementItem: (token: string, productId: string) => Promise<void>;

  /** Set absolute quantity for an item, sync to backend */
  setItemQty: (
    token: string,
    productId: string,
    qty: number,
    onHand: number,
    trackInventory: boolean,
  ) => Promise<void>;

  /** Checkout: calls POST /orders/:id/checkout */
  checkout: (token: string, payload: CheckoutPayload) => Promise<boolean>;

  /** Load an existing draft order into POS session */
  loadDraftOrder: (token: string, orderId: string) => Promise<boolean>;

  /** Cancel the draft order */
  cancel: (token: string) => Promise<boolean>;

  /** Reset session (called after checkout/cancel success) */
  resetSession: () => void;

  clearError: () => void;
}

// ── Helper: build items payload from cart ────────────────────

function buildPayload(items: PosCartItem[]) {
  return items
    .filter((it) => it.quantity > 0)
    .map((it) => ({ product_id: it.productId, quantity: it.quantity }));
}

// ── Helper: compute local grand total ───────────────────────

function calcTotal(items: PosCartItem[]): number {
  return items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
}

function mapApiItemsToCart(items: ApiOrderItem[]): PosCartItem[] {
  return items.map((it) => ({
    itemId: `si_${it.product_id}`,
    productId: it.product_id,
    productName: it.product_name_snapshot,
    unitPrice: it.unit_price,
    quantity: it.quantity,
  }));
}

// ── Store ────────────────────────────────────────────────────

export const usePosStore = create<PosState>((set, get) => ({
  orderId: null,
  orderCode: null,
  items: [],
  grandTotal: 0,
  isCreatingOrder: false,
  isUpdatingItems: false,
  isCheckingOut: false,
  isCancelling: false,
  error: null,

  ensureDraftOrder: async (token) => {
    const existing = get().orderId;
    if (existing) return existing;

    set({ isCreatingOrder: true, error: null });
    try {
      const result = await createDraftOrder(token);
      const { order_id, order_code } = result.order;
      set({ orderId: order_id, orderCode: order_code, isCreatingOrder: false });
      return order_id;
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Không thể tạo đơn hàng";
      set({ isCreatingOrder: false, error: msg });
      return null;
    }
  },

  addPickedItems: async (token, picked) => {
    // 1. Validate inventory limits against trackInventory rules
    const validationError: string[] = [];
    const current = get().items;
    picked.forEach((p) => {
      if (!p.trackInventory) return; // no stock limit
      const existingQty =
        current.find((it) => it.productId === p.productId)?.quantity ?? 0;
      if (existingQty + p.quantity > p.onHand) {
        validationError.push(
          `"${p.productName}" chỉ còn ${p.onHand - existingQty} trong kho`,
        );
      }
    });
    if (validationError.length > 0) {
      set({ error: validationError.join("\n") });
      return;
    }

    // 2. Ensure we have a draft order
    const orderId = await get().ensureDraftOrder(token);
    if (!orderId) return; // error already set by ensureDraftOrder

    // 3. Merge into local cart
    const next = [...current];
    picked.forEach((p) => {
      const idx = next.findIndex((it) => it.productId === p.productId);
      if (idx >= 0) {
        next[idx] = { ...next[idx], quantity: next[idx].quantity + p.quantity };
      } else {
        next.push({
          itemId: `si_${p.productId}`,
          productId: p.productId,
          productName: p.productName,
          unitPrice: p.unitPrice,
          quantity: p.quantity,
        });
      }
    });

    set({ items: next, grandTotal: calcTotal(next) });

    // 4. Sync to backend
    set({ isUpdatingItems: true, error: null });
    try {
      await updateOrderItems(token, orderId, buildPayload(next));
      set({ isUpdatingItems: false });
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Không thể cập nhật giỏ hàng";
      // Rollback to previous cart on failure
      set({
        items: current,
        grandTotal: calcTotal(current),
        isUpdatingItems: false,
        error: msg,
      });
    }
  },

  incrementItem: async (token, productId, onHand, trackInventory) => {
    const current = get().items;
    const item = current.find((it) => it.productId === productId);
    if (!item) return;

    if (trackInventory && item.quantity >= onHand) {
      set({ error: `"${item.productName}" chỉ còn ${onHand} trong kho` });
      return;
    }

    const next = current.map((it) =>
      it.productId === productId ? { ...it, quantity: it.quantity + 1 } : it,
    );
    set({ items: next, grandTotal: calcTotal(next) });

    const orderId = get().orderId;
    if (!orderId) return;

    set({ isUpdatingItems: true, error: null });
    try {
      await updateOrderItems(token, orderId, buildPayload(next));
      set({ isUpdatingItems: false });
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Không thể cập nhật giỏ hàng";
      set({
        items: current,
        grandTotal: calcTotal(current),
        isUpdatingItems: false,
        error: msg,
      });
    }
  },

  decrementItem: async (token, productId) => {
    const current = get().items;
    const item = current.find((it) => it.productId === productId);
    if (!item) return;

    const next = current
      .map((it) =>
        it.productId === productId ? { ...it, quantity: it.quantity - 1 } : it,
      )
      .filter((it) => it.quantity > 0);
    set({ items: next, grandTotal: calcTotal(next) });

    const orderId = get().orderId;
    if (!orderId) return;

    set({ isUpdatingItems: true, error: null });
    try {
      await updateOrderItems(token, orderId, buildPayload(next));
      set({ isUpdatingItems: false });
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Không thể cập nhật giỏ hàng";
      set({
        items: current,
        grandTotal: calcTotal(current),
        isUpdatingItems: false,
        error: msg,
      });
    }
  },

  setItemQty: async (token, productId, qty, onHand, trackInventory) => {
    const current = get().items;
    const item = current.find((it) => it.productId === productId);
    if (!item) return;

    if (trackInventory && qty > onHand) {
      set({ error: `"${item.productName}" chỉ còn ${onHand} trong kho` });
      return;
    }

    const next = current
      .map((it) => (it.productId === productId ? { ...it, quantity: qty } : it))
      .filter((it) => it.quantity > 0);
    set({ items: next, grandTotal: calcTotal(next) });

    const orderId = get().orderId;
    if (!orderId) return;

    set({ isUpdatingItems: true, error: null });
    try {
      await updateOrderItems(token, orderId, buildPayload(next));
      set({ isUpdatingItems: false });
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Không thể cập nhật giỏ hàng";
      set({
        items: current,
        grandTotal: calcTotal(current),
        isUpdatingItems: false,
        error: msg,
      });
    }
  },

  loadDraftOrder: async (token, orderId) => {
    set({ isCreatingOrder: true, error: null });
    try {
      const result = await getOrderDetail(token, orderId);
      if (result.order.status !== "draft") {
        set({
          isCreatingOrder: false,
          error: "Đơn hàng này không còn ở trạng thái nháp",
        });
        return false;
      }

      const cartItems = mapApiItemsToCart(result.items);
      set({
        orderId: result.order.order_id,
        orderCode: result.order.order_code,
        items: cartItems,
        grandTotal: result.order.grand_total ?? calcTotal(cartItems),
        isCreatingOrder: false,
      });
      return true;
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.getFieldErrors() || err.message
          : "Không thể tải đơn nháp";
      set({ isCreatingOrder: false, error: msg });
      return false;
    }
  },

  checkout: async (token, payload) => {
    const { orderId, items } = get();
    if (!orderId) {
      set({ error: "Chưa có đơn hàng" });
      return false;
    }
    if (items.length === 0) {
      set({ error: "Đơn hàng chưa có sản phẩm nào" });
      return false;
    }

    set({ isCheckingOut: true, error: null });
    try {
      await checkoutOrder(token, orderId, payload);
      set({ isCheckingOut: false });
      return true;
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.getFieldErrors() || err.message
          : "Thanh toán thất bại";
      set({ isCheckingOut: false, error: msg });
      return false;
    }
  },

  cancel: async (token) => {
    const { orderId } = get();
    if (!orderId) {
      set({ error: "Chưa có đơn hàng để hủy" });
      return false;
    }

    set({ isCancelling: true, error: null });
    try {
      await cancelDraftOrder(token, orderId);
      set({ isCancelling: false });
      return true;
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Không thể hủy đơn hàng";
      set({ isCancelling: false, error: msg });
      return false;
    }
  },

  resetSession: () => {
    set({
      orderId: null,
      orderCode: null,
      items: [],
      grandTotal: 0,
      isCreatingOrder: false,
      isUpdatingItems: false,
      isCheckingOut: false,
      isCancelling: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
