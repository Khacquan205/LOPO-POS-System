// ── Order Types ──────────────────────────────────────────────
export const OrderStatus = {
  DRAFT: 'DRAFT',
  NEW: 'NEW',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface Order {
  id: string;
  code: string;
  status: OrderStatusType;
  createdAt: string; // ISO string
  total: number;
}

// ── Status Labels (Vietnamese) ───────────────────────────────
export const STATUS_LABELS: Record<OrderStatusType, string> = {
  DRAFT: 'Đơn nháp',
  NEW: 'Đơn mới',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

export const STATUS_FILTER_LABELS: Record<OrderStatusType | 'ALL', string> = {
  ALL: 'Tất cả',
  DRAFT: 'Nháp',
  NEW: 'Mới',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Hủy',
};

// ── Helpers ──────────────────────────────────────────────────
export const formatCurrencyVND = (amount: number): string => {
  return amount.toLocaleString('vi-VN') + '₫';
};

export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

// ── Mock Data (20+ orders) ───────────────────────────────────
export const ordersMock: Order[] = [
  {
    id: '1',
    code: 'SO00000001',
    status: 'NEW',
    createdAt: '2026-03-02T08:30:00.000Z',
    total: 150000,
  },
  {
    id: '2',
    code: 'SO00000002',
    status: 'COMPLETED',
    createdAt: '2026-03-02T09:15:00.000Z',
    total: 235000,
  },
  {
    id: '3',
    code: 'SO00000003',
    status: 'DRAFT',
    createdAt: '2026-03-02T10:00:00.000Z',
    total: 89000,
  },
  {
    id: '4',
    code: 'SO00000004',
    status: 'CANCELLED',
    createdAt: '2026-03-02T10:45:00.000Z',
    total: 320000,
  },
  {
    id: '5',
    code: 'SO00000005',
    status: 'NEW',
    createdAt: '2026-03-02T11:20:00.000Z',
    total: 175000,
  },
  {
    id: '6',
    code: 'SO00000006',
    status: 'COMPLETED',
    createdAt: '2026-03-02T12:00:00.000Z',
    total: 450000,
  },
  {
    id: '7',
    code: 'SO00000007',
    status: 'DRAFT',
    createdAt: '2026-03-02T13:30:00.000Z',
    total: 67000,
  },
  {
    id: '8',
    code: 'SO00000008',
    status: 'NEW',
    createdAt: '2026-03-02T14:15:00.000Z',
    total: 195000,
  },
  {
    id: '9',
    code: 'SO00000009',
    status: 'COMPLETED',
    createdAt: '2026-03-02T15:00:00.000Z',
    total: 285000,
  },
  {
    id: '10',
    code: 'SO00000010',
    status: 'CANCELLED',
    createdAt: '2026-03-02T15:45:00.000Z',
    total: 120000,
  },
  {
    id: '11',
    code: 'SO00000011',
    status: 'NEW',
    createdAt: '2026-03-01T08:00:00.000Z',
    total: 340000,
  },
  {
    id: '12',
    code: 'SO00000012',
    status: 'COMPLETED',
    createdAt: '2026-03-01T09:30:00.000Z',
    total: 520000,
  },
  {
    id: '13',
    code: 'SO00000013',
    status: 'DRAFT',
    createdAt: '2026-03-01T10:15:00.000Z',
    total: 98000,
  },
  {
    id: '14',
    code: 'SO00000014',
    status: 'NEW',
    createdAt: '2026-03-01T11:00:00.000Z',
    total: 210000,
  },
  {
    id: '15',
    code: 'SO00000015',
    status: 'COMPLETED',
    createdAt: '2026-03-01T12:30:00.000Z',
    total: 380000,
  },
  {
    id: '16',
    code: 'SO00000016',
    status: 'CANCELLED',
    createdAt: '2026-03-01T13:15:00.000Z',
    total: 165000,
  },
  {
    id: '17',
    code: 'SO00000017',
    status: 'DRAFT',
    createdAt: '2026-03-01T14:00:00.000Z',
    total: 75000,
  },
  {
    id: '18',
    code: 'SO00000018',
    status: 'NEW',
    createdAt: '2026-03-01T15:30:00.000Z',
    total: 290000,
  },
  {
    id: '19',
    code: 'SO00000019',
    status: 'COMPLETED',
    createdAt: '2026-03-01T16:00:00.000Z',
    total: 410000,
  },
  {
    id: '20',
    code: 'SO00000020',
    status: 'NEW',
    createdAt: '2026-02-28T09:00:00.000Z',
    total: 185000,
  },
  {
    id: '21',
    code: 'SO00000021',
    status: 'COMPLETED',
    createdAt: '2026-02-28T10:30:00.000Z',
    total: 620000,
  },
  {
    id: '22',
    code: 'SO00000022',
    status: 'DRAFT',
    createdAt: '2026-02-28T11:15:00.000Z',
    total: 55000,
  },
];

// ── Get count by status ──────────────────────────────────────
export const getOrderCountByStatus = (
  orders: Order[],
  status?: OrderStatusType,
): number => {
  if (!status) return orders.length;
  return orders.filter((o) => o.status === status).length;
};
