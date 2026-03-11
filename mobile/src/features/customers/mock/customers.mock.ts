// ── Customer Types ───────────────────────────────────────────
export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
}

// ── Mock Data ────────────────────────────────────────────────
export const customersMock: Customer[] = [
  { id: '1', code: 'CUS00000001', name: 'Nguyễn Văn Thành', phone: '0365416503', totalOrders: 15, totalSpent: 2500000 },
  { id: '2', code: 'CUS00000002', name: 'Trịnh Thành Đạt', phone: '0365416501', totalOrders: 8, totalSpent: 1200000 },
  { id: '3', code: 'CUS00000003', name: 'Lương Minh Trang', phone: '0912345600', totalOrders: 22, totalSpent: 4500000 },
  { id: '4', code: 'CUS00000004', name: 'Nguyễn Việt Nam', phone: '0912345678', totalOrders: 5, totalSpent: 750000 },
  { id: '5', code: 'CUS00000005', name: 'Lê Trung Lương', phone: '0923456789', totalOrders: 12, totalSpent: 1800000 },
  { id: '6', code: 'CUS00000006', name: 'Nguyễn Bá Trạc', phone: '0934567890', totalOrders: 3, totalSpent: 450000 },
  { id: '7', code: 'CUS00000007', name: 'Đặng Văn Giang', phone: '0967890123', totalOrders: 18, totalSpent: 3200000 },
  { id: '8', code: 'CUS00000008', name: 'Bùi Thị Hoa', phone: '0978901234', totalOrders: 7, totalSpent: 980000 },
];

// ── Helpers ──────────────────────────────────────────────────
let nextCustomerId = customersMock.length + 1;

export const createCustomer = (name: string, phone: string): Customer => {
  const id = String(nextCustomerId++);
  const customer: Customer = {
    id,
    code: `CUS${id.padStart(8, '0')}`,
    name,
    phone,
    totalOrders: 0,
    totalSpent: 0,
  };
  customersMock.push(customer);
  return customer;
};
