// ── Staff Types ──────────────────────────────────────────────
export type StaffRole = 'owner' | 'manager' | 'cashier' | 'staff';

export interface Staff {
  id: string;
  name: string;
  phone: string;
  role: StaffRole;
  isActive: boolean;
}

export const ROLE_LABELS: Record<StaffRole, string> = {
  owner: 'Chủ cửa hàng',
  manager: 'Quản lý',
  cashier: 'Thu ngân',
  staff: 'Nhân viên',
};

// ── Mock Data ────────────────────────────────────────────────
export const staffMock: Staff[] = [
  { id: '1', name: 'Nguyễn Văn Hùng', phone: '0901111111', role: 'owner', isActive: true },
  { id: '2', name: 'Trần Thị Mai', phone: '0902222222', role: 'manager', isActive: true },
  { id: '3', name: 'Lê Văn Tú', phone: '0903333333', role: 'cashier', isActive: true },
  { id: '4', name: 'Phạm Thị Lan', phone: '0904444444', role: 'staff', isActive: true },
  { id: '5', name: 'Hoàng Văn Nam', phone: '0905555555', role: 'staff', isActive: false },
  { id: '6', name: 'Vũ Thị Hương', phone: '0906666666', role: 'cashier', isActive: true },
];
