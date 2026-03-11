// ── Order Types ──────────────────────────────────────────────
export const OrderStatus = {
  DRAFT: 'DRAFT',
  NEW: 'NEW',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  note?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
}

export interface Staff {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  code: string;
  status: OrderStatusType;
  createdAt: string;
  total: number;
  items: OrderItem[];
  customer?: Customer;
  staff?: Staff;
  note?: string;
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

export const STATUS_COLORS: Record<OrderStatusType, string> = {
  DRAFT: '#4280EF',
  NEW: '#4280EF',
  COMPLETED: '#10B981',
  CANCELLED: '#9CA3AF',
};

export const STATUS_BG_COLORS: Record<OrderStatusType, string> = {
  DRAFT: '#EBF2FF',
  NEW: '#EBF2FF',
  COMPLETED: '#D1FAE5',
  CANCELLED: '#F3F4F6',
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

export const getOrderCountByStatus = (
  orders: Order[],
  status: OrderStatusType,
): number => orders.filter((o) => o.status === status).length;

export const getOrderById = (id: string): Order | undefined =>
  ordersMock.find((o) => o.id === id);

// ── Mock Data ────────────────────────────────────────────────
export const ordersMock: Order[] = [
  {
    id: '15',
    code: 'SO0000015',
    status: 'DRAFT',
    createdAt: '2026-03-08T14:30:00.000Z',
    total: 50000,
    customer: { id: 'c1', name: 'Nguyễn Văn Thành', phone: '0901234567' },
    staff: { id: 's1', name: 'Trần Minh Quân' },
    items: [
      { id: 'i1', productId: 'p1', productName: 'Bánh mì', unitPrice: 15000, quantity: 2 },
      { id: 'i2', productId: 'p2', productName: 'Bịch kẹo Bibica', unitPrice: 20000, quantity: 1 },
    ],
  },
  {
    id: '14',
    code: 'SO0000014',
    status: 'NEW',
    createdAt: '2026-03-08T12:00:00.000Z',
    total: 60000,
    customer: { id: 'c2', name: 'Lê Thị Hoa', phone: '0912345678' },
    staff: { id: 's1', name: 'Trần Minh Quân' },
    items: [
      { id: 'i3', productId: 'p3', productName: 'Kem Merino', unitPrice: 20000, quantity: 3 },
    ],
  },
  {
    id: '13',
    code: 'SO0000013',
    status: 'DRAFT',
    createdAt: '2026-03-08T10:45:00.000Z',
    total: 89000,
    customer: { id: 'c3', name: 'Phạm Hùng', phone: '0923456789' },
    staff: { id: 's1', name: 'Trần Minh Quân' },
    items: [
      { id: 'i4', productId: 'p4', productName: 'Nước rửa chén Sunlight', unitPrice: 35000, quantity: 1 },
      { id: 'i5', productId: 'p1', productName: 'Bánh mì', unitPrice: 15000, quantity: 1 },
      { id: 'i6', productId: 'p2', productName: 'Bịch kẹo Bibica', unitPrice: 39000, quantity: 1 },
    ],
  },
  {
    id: '12',
    code: 'SO0000012',
    status: 'COMPLETED',
    createdAt: '2026-03-07T16:20:00.000Z',
    total: 20000,
    customer: { id: 'c1', name: 'Nguyễn Văn Thành', phone: '0901234567' },
    staff: { id: 's2', name: 'Nguyễn Thị Lan' },
    items: [
      { id: 'i7', productId: 'p3', productName: 'Kem Merino', unitPrice: 20000, quantity: 1 },
    ],
  },
  {
    id: '11',
    code: 'SO0000011',
    status: 'CANCELLED',
    createdAt: '2026-03-07T14:00:00.000Z',
    total: 110000,
    customer: { id: 'c4', name: 'Trần Văn Bình', phone: '0934567890' },
    staff: { id: 's1', name: 'Trần Minh Quân' },
    items: [
      { id: 'i8', productId: 'p4', productName: 'Nước rửa chén Sunlight', unitPrice: 35000, quantity: 2 },
      { id: 'i9', productId: 'p2', productName: 'Bịch kẹo Bibica', unitPrice: 20000, quantity: 2 },
      { id: 'i10', productId: 'p1', productName: 'Bánh mì', unitPrice: 10000, quantity: 1 },
    ],
  },
  {
    id: '10',
    code: 'SO0000010',
    status: 'NEW',
    createdAt: '2026-03-06T09:00:00.000Z',
    total: 175000,
    customer: { id: 'c5', name: 'Hoàng Thị Mai', phone: '0945678901' },
    staff: { id: 's2', name: 'Nguyễn Thị Lan' },
    items: [
      { id: 'i11', productId: 'p5', productName: 'Sữa TH True Milk 1L', unitPrice: 35000, quantity: 5 },
    ],
  },
  {
    id: '9',
    code: 'SO0000009',
    status: 'COMPLETED',
    createdAt: '2026-03-06T07:30:00.000Z',
    total: 285000,
    customer: { id: 'c6', name: 'Vũ Tuấn Anh', phone: '0956789012' },
    staff: { id: 's1', name: 'Trần Minh Quân' },
    items: [
      { id: 'i12', productId: 'p6', productName: 'Mì gói Hảo Hảo', unitPrice: 5000, quantity: 10 },
      { id: 'i13', productId: 'p7', productName: 'Dầu gội Clear 180ml', unitPrice: 55000, quantity: 2 },
      { id: 'i14', productId: 'p4', productName: 'Nước rửa chén Sunlight', unitPrice: 35000, quantity: 2 },
      { id: 'i15', productId: 'p5', productName: 'Sữa TH True Milk 1L', unitPrice: 35000, quantity: 2 },
    ],
  },
  {
    id: '8',
    code: 'SO0000008',
    status: 'CANCELLED',
    createdAt: '2026-03-05T15:45:00.000Z',
    total: 45000,
    customer: undefined,
    staff: { id: 's2', name: 'Nguyễn Thị Lan' },
    items: [
      { id: 'i16', productId: 'p3', productName: 'Kem Merino', unitPrice: 20000, quantity: 1 },
      { id: 'i17', productId: 'p1', productName: 'Bánh mì', unitPrice: 15000, quantity: 1 },
      { id: 'i18', productId: 'p6', productName: 'Mì gói Hảo Hảo', unitPrice: 10000, quantity: 1 },
    ],
  },
  {
    id: '7',
    code: 'SO0000007',
    status: 'COMPLETED',
    createdAt: '2026-03-05T13:10:00.000Z',
    total: 195000,
    customer: { id: 'c7', name: 'Đặng Thùy Linh', phone: '0967890123' },
    staff: { id: 's1', name: 'Trần Minh Quân' },
    items: [
      { id: 'i19', productId: 'p7', productName: 'Dầu gội Clear 180ml', unitPrice: 55000, quantity: 1 },
      { id: 'i20', productId: 'p5', productName: 'Sữa TH True Milk 1L', unitPrice: 35000, quantity: 4 },
    ],
  },
  {
    id: '6',
    code: 'SO0000006',
    status: 'DRAFT',
    createdAt: '2026-03-05T08:00:00.000Z',
    total: 67000,
    customer: { id: 'c8', name: 'Bùi Minh Khoa', phone: '0978901234' },
    staff: { id: 's1', name: 'Trần Minh Quân' },
    items: [
      { id: 'i21', productId: 'p2', productName: 'Bịch kẹo Bibica', unitPrice: 20000, quantity: 2 },
      { id: 'i22', productId: 'p6', productName: 'Mì gói Hảo Hảo', unitPrice: 5000, quantity: 3 },
      { id: 'i23', productId: 'p1', productName: 'Bánh mì', unitPrice: 12000, quantity: 1 },
    ],
  },
];
