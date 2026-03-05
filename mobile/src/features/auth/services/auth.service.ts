import { apiRequest, decodeJwtPayload } from '../../../lib/api/client';
import type { AuthPayload } from '../../../types';

// ── Request / Response shapes ─────────────────────────────────

export interface LoginRequest {
  phone_number: string;
  password: string;
}
export interface RegisterOwnerRequest {
  store_name: string;
  full_name: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

export interface RegisterStaffRequest {
  full_name: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}
interface LoginResult {
  access_token: string;
  refresh_token: string;
}

interface LoginResponse {
  message: string;
  result: LoginResult;
}

interface RegisterOwnerResult {
  access_token: string;
  refresh_token: string;
  owner: {
    _id: string;
    full_name: string;
    phone_number: string;
    role: 'owner';
  };
  store: {
    _id: string;
    name: string;
  };
}

interface RegisterOwnerResponse {
  message: string;
  result: RegisterOwnerResult;
}

interface RegisterStaffResult {
  access_token: string;
  refresh_token: string;
  staff: {
    _id: string;
    full_name: string;
    phone_number: string;
    role: 'staff';
  };
}

interface RegisterStaffResponse {
  message: string;
  result: RegisterStaffResult;
}

interface JwtPayload {
  user_id: string;
  role: 'owner' | 'staff' | 'admin';
}

// ── Login ─────────────────────────────────────────────────────

export async function login(phone: string, password: string): Promise<AuthPayload> {
  const body: LoginRequest = { phone_number: phone, password };

  const data = await apiRequest<LoginResponse>('/users/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const { access_token, refresh_token } = data.result;
  const payload = decodeJwtPayload<JwtPayload>(access_token);

  return {
    user: {
      id: payload.user_id ?? '',
      name: '',
      phone,
      role: payload.role ?? 'staff',
      storeId: null,
      storeName: null,
    },
    accessToken: access_token,
    refreshToken: refresh_token,
  };
}

// ── Register Owner ─────────────────────────────────────────────────

export async function registerOwner(
  storeName: string,
  ownerName: string,
  phone: string,
  password: string,
  confirmPassword: string,
): Promise<AuthPayload> {
  const body: RegisterOwnerRequest = {
    store_name: storeName,
    full_name: ownerName,
    phone_number: phone,
    password,
    confirm_password: confirmPassword,
  };

  const data = await apiRequest<RegisterOwnerResponse>('/users/register-owner', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const { access_token, refresh_token, owner, store } = data.result;

  return {
    user: {
      id: owner._id,
      name: owner.full_name,
      phone: owner.phone_number,
      role: owner.role,
      storeId: store._id,
      storeName: store.name,
    },
    accessToken: access_token,
    refreshToken: refresh_token,
  };
}

// ── Register Staff ───────────────────────────────────────────────

export async function registerStaff(
  fullName: string,
  phone: string,
  password: string,
  confirmPassword: string,
): Promise<AuthPayload> {
  const body: RegisterStaffRequest = {
    full_name: fullName,
    phone_number: phone,
    password,
    confirm_password: confirmPassword,
  };

  const data = await apiRequest<RegisterStaffResponse>('/users/register-staff', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const { access_token, refresh_token, staff } = data.result;

  return {
    user: {
      id: staff._id,
      name: staff.full_name,
      phone: staff.phone_number,
      role: staff.role,
      storeId: null,
      storeName: null,
    },
    accessToken: access_token,
    refreshToken: refresh_token,
  };
}

// ── Logout ──────────────────────────────────────────────────────

export async function logout(accessToken: string, refreshToken: string): Promise<void> {
  await apiRequest<{ message: string }>('/users/logout', {
    method: 'POST',
    token: accessToken,
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

// ── Refresh Token ───────────────────────────────────────────────

interface RefreshTokenResponse {
  message: string;
  result: {
    access_token: string;
    refresh_token: string;
  };
}

/** Đổi refresh_token lấy cặp token mới. Trả về { accessToken, refreshToken } */
export async function refreshTokens(
  currentRefreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const data = await apiRequest<RefreshTokenResponse>('/users/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: currentRefreshToken }),
  });

  return {
    accessToken: data.result.access_token,
    refreshToken: data.result.refresh_token,
  };
}
