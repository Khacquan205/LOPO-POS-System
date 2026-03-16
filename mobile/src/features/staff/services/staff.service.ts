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

export interface PendingJoinRequestItem {
  request_id: string;
  staff_user_id?: string;
  staff_full_name?: string;
  staff_phone_number?: string;
  status?: string;
  rejected_count?: number;
  requested_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PendingJoinRequestsResponse {
  message: string;
  result: PendingJoinRequestItem[];
}

interface ApproveJoinRequestResponse {
  message: string;
  result: {
    request_id: string;
    status: 'approved';
    staff_user_id: string;
    store_id: string;
    store_name: string;
  };
}

interface RejectJoinRequestResponse {
  message: string;
  result: {
    request_id: string;
    status: 'rejected';
  };
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

export async function getPendingJoinRequests(accessToken: string): Promise<PendingJoinRequestItem[]> {
  const data = await apiRequest<PendingJoinRequestsResponse>('/stores/join-requests/pending', {
    method: 'GET',
    token: accessToken,
  });

  return Array.isArray(data.result) ? data.result : [];
}

export async function approveJoinRequest(
  accessToken: string,
  requestId: string,
): Promise<ApproveJoinRequestResponse['result']> {
  const data = await apiRequest<ApproveJoinRequestResponse>(
    `/stores/join-requests/${encodeURIComponent(requestId)}/approve`,
    {
      method: 'POST',
      token: accessToken,
    },
  );

  return data.result;
}

export async function rejectJoinRequest(
  accessToken: string,
  requestId: string,
): Promise<RejectJoinRequestResponse['result']> {
  const data = await apiRequest<RejectJoinRequestResponse>(
    `/stores/join-requests/${encodeURIComponent(requestId)}/reject`,
    {
      method: 'POST',
      token: accessToken,
    },
  );

  return data.result;
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
