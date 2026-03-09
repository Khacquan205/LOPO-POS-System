// ── Approval Types ───────────────────────────────────────────
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'blocked';

export interface StaffApproval {
  id: string;
  staffCode: string;
  name: string;
  phone: string;
  createdAt: string;
  status: ApprovalStatus;
  rejectedCount: number;
}

export const approvalMock: StaffApproval[] = [
  { id: 'a1', staffCode: 'ST00000035', name: 'Nguyễn Văn Thành', phone: '0365416503', createdAt: '20/10/2025 11:05:00', status: 'pending',  rejectedCount: 3 },
  { id: 'a2', staffCode: 'ST00000035', name: 'Nguyễn Văn Thành', phone: '0365416503', createdAt: '20/10/2025 11:05:00', status: 'pending',  rejectedCount: 0 },
  { id: 'a3', staffCode: 'ST00000035', name: 'Nguyễn Văn Thành', phone: '0365416503', createdAt: '20/10/2025 11:05:00', status: 'approved', rejectedCount: 0 },
  { id: 'a4', staffCode: 'ST00000035', name: 'Nguyễn Văn Thành', phone: '0365416503', createdAt: '20/10/2025 11:05:00', status: 'approved', rejectedCount: 0 },
  { id: 'a5', staffCode: 'ST00000035', name: 'Nguyễn Văn Thành', phone: '0365416503', createdAt: '20/10/2025 11:05:00', status: 'rejected', rejectedCount: 0 },
  { id: 'a6', staffCode: 'ST00000035', name: 'Nguyễn Văn Thành', phone: '0365416503', createdAt: '20/10/2025 11:05:00', status: 'blocked',  rejectedCount: 0 },
];

// ── Staff Types ──────────────────────────────────────────────
export type StaffRole = 'owner' | 'manager' | 'cashier' | 'staff';

export interface Staff {
  id: string;
  staffCode: string;
  name: string;
  phone: string;
  role: StaffRole;
  isActive: boolean;
  createdAt: string; // 'DD/MM/YYYY HH:mm:ss'
}

export const ROLE_LABELS: Record<StaffRole, string> = {
  owner: 'Chủ cửa hàng',
  manager: 'Quản lý',
  cashier: 'Thu ngân',
  staff: 'Nhân viên',
};

// ── Mock Data ────────────────────────────────────────────────
export const staffMock: Staff[] = [
  { id: '1', staffCode: 'ST00000031', name: 'Nguyễn Văn Hùng',  phone: '0901111111', role: 'owner',   isActive: true,  createdAt: '20/10/2025 11:05:00' },
  { id: '2', staffCode: 'ST00000032', name: 'Trần Thị Mai',     phone: '0902222222', role: 'manager', isActive: true,  createdAt: '20/10/2025 11:05:00' },
  { id: '3', staffCode: 'ST00000033', name: 'Lê Văn Tú',        phone: '0903333333', role: 'cashier', isActive: true,  createdAt: '20/10/2025 11:05:00' },
  { id: '4', staffCode: 'ST00000034', name: 'Phạm Thị Lan',     phone: '0904444444', role: 'staff',   isActive: true,  createdAt: '20/10/2025 11:05:00' },
  { id: '5', staffCode: 'ST00000035', name: 'Nguyễn Văn Thành', phone: '0365416503', role: 'staff',   isActive: false, createdAt: '20/10/2025 11:05:00' },
  { id: '6', staffCode: 'ST00000036', name: 'Vũ Thị Hương',     phone: '0906666666', role: 'cashier', isActive: false, createdAt: '20/10/2025 11:05:00' },
];
