// ── API status values (from backend) ────────────────────────
export type OrderStatusApi = 'draft' | 'completed' | 'cancelled';

export const STATUS_LABELS: Record<OrderStatusApi, string> = {
  draft: 'Nháp',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export const STATUS_FILTER_LABELS: Record<OrderStatusApi | 'ALL', string> = {
  ALL: 'Tất cả',
  draft: 'Nháp',
  completed: 'Hoàn thành',
  cancelled: 'Hủy',
};

export const STATUS_COLORS: Record<OrderStatusApi, string> = {
  draft: '#4280EF',
  completed: '#10B981',
  cancelled: '#9CA3AF',
};

export const STATUS_BG_COLORS: Record<OrderStatusApi, string> = {
  draft: '#EBF2FF',
  completed: '#D1FAE5',
  cancelled: '#F3F4F6',
};

// ── Currency / date helpers ──────────────────────────────────
export const formatCurrencyVND = (amount: number): string =>
  amount.toLocaleString('vi-VN') + '₫';

export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
};

// ── Display types (decoupled from raw API shape) ─────────────

/** Minimal shape OrderRow needs to render */
export interface OrderRowData {
  id: string;
  code: string;
  status: OrderStatusApi;
  createdAt: string;
  grandTotal: number;
  customer?: { name: string };
}

/** Minimal shape OrderProductRow needs to render */
export interface OrderItemDisplay {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  note?: string;
}
