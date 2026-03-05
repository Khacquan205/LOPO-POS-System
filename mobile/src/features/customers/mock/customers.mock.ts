// ── Customer Types ───────────────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
}

// ── Mock Data ────────────────────────────────────────────────
export const customersMock: Customer[] = [
  { id: '1', name: 'Nguyễn Văn An', phone: '0901234567', email: 'an@email.com', totalOrders: 15, totalSpent: 2500000 },
  { id: '2', name: 'Trần Thị Bình', phone: '0912345678', totalOrders: 8, totalSpent: 1200000 },
  { id: '3', name: 'Lê Văn Cường', phone: '0923456789', email: 'cuong@email.com', totalOrders: 22, totalSpent: 4500000 },
  { id: '4', name: 'Phạm Thị Dung', phone: '0934567890', totalOrders: 5, totalSpent: 750000 },
  { id: '5', name: 'Hoàng Văn Em', phone: '0945678901', email: 'em@email.com', totalOrders: 12, totalSpent: 1800000 },
  { id: '6', name: 'Vũ Thị Phương', phone: '0956789012', totalOrders: 3, totalSpent: 450000 },
  { id: '7', name: 'Đặng Văn Giang', phone: '0967890123', email: 'giang@email.com', totalOrders: 18, totalSpent: 3200000 },
  { id: '8', name: 'Bùi Thị Hoa', phone: '0978901234', totalOrders: 7, totalSpent: 980000 },
];
