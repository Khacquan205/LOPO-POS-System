import { apiRequest } from '../../../lib/api/client';

// ── Types ────────────────────────────────────────────────────

export type JoinRequestStatus = 'pending' | 'approved' | 'rejected';

export interface MyJoinRequest {
  request_id: string;
  store_id: string;
  store_name: string;
  status: JoinRequestStatus;
  requested_at: string;
  reviewed_at: string | null;
}

interface GetMyJoinRequestsResponse {
  message: string;
  result: MyJoinRequest[];
}

// ── API call ─────────────────────────────────────────────────

export async function getMyJoinRequests(token: string): Promise<MyJoinRequest[]> {
  const data = await apiRequest<GetMyJoinRequestsResponse>('/stores/my-join-requests', {
    method: 'GET',
    token,
  });
  return data.result;
}
