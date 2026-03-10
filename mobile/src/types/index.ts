// ── User ─────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'owner' | 'staff';
  storeId: string | null;
  storeName: string | null;
}

// ── Auth payload returned by login / register ────────────────
export interface AuthPayload {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

// ── Auth types / constants ───────────────────────────────────
export const UserRole = {
  OWNER: 'owner',
  STAFF: 'staff',
} as const;

export type UserRoleValue = (typeof UserRole)[keyof typeof UserRole];

export const AuthStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type AuthStatusValue = (typeof AuthStatus)[keyof typeof AuthStatus];

// ── Dashboard mock types ─────────────────────────────────────
export interface DashboardStats {
  todayRevenue: string;
  todayOrders: number;
  monthRevenue: string;
  monthOrders: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  total: string;
  time: string;
}

export interface TopProduct {
  id: string;
  name: string;
  quantity: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}
