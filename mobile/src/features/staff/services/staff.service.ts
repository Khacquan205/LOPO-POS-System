import { apiRequest } from '../../../lib/api/client';

export interface OwnerStaffItem {
  user_id: string;
  full_name: string;
  phone_number: string;
  role: string;
  store_id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface OwnerStaffListResponse {
  message: string;
  result: OwnerStaffItem[];
}

interface CreateOwnerStaffRequest {
  full_name: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

interface CreateOwnerStaffResponse {
  message: string;
  result: {
    access_token: string;
    refresh_token: string;
    staff: {
      user_id: string;
      full_name: string;
      phone_number: string;
      role: string;
      created_at: string;
      updated_at: string;
    };
  };
}

export async function getOwnerStaffList(accessToken: string): Promise<OwnerStaffItem[]> {
  const data = await apiRequest<OwnerStaffListResponse>('/users/owner/staff-list', {
    method: 'GET',
    token: accessToken,
  });

  return Array.isArray(data.result) ? data.result : [];
}

export async function createOwnerStaff(
  accessToken: string,
  payload: CreateOwnerStaffRequest,
): Promise<CreateOwnerStaffResponse['result']> {
  const data = await apiRequest<CreateOwnerStaffResponse>('/users/owner/staff', {
    method: 'POST',
    token: accessToken,
    body: JSON.stringify(payload),
  });

  return data.result;
}
