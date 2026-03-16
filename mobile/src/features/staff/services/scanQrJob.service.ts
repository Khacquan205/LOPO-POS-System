import { apiRequest } from '../../../lib/api/client';

// ── Types ────────────────────────────────────────────────────

export interface StorePreview {
  store_id: string;
  store_name: string;
  owner_name: string | null;
  owner_phone: string | null;
}

interface StorePreviewResponse {
  message: string;
  result: StorePreview;
}

interface JoinByQrResponse {
  message: string;
  result: {
    request_id: string;
    store_id: string;
    store_name: string;
    staff_user_id: string;
    status: string;
    requested_at: string;
  };
}

// ── API calls ─────────────────────────────────────────────────

/**
 * Lấy thông tin cửa hàng theo QR trước khi gửi yêu cầu (preview).
 * Backend: GET /api/stores/preview-by-qr?qr_code=xxx
 */
export async function getStorePreviewByQr(
  token: string,
  qr_code: string,
): Promise<StorePreview> {
  const encodedQr = encodeURIComponent(qr_code);
  const data = await apiRequest<StorePreviewResponse>(
    `/stores/preview-by-qr?qr_code=${encodedQr}`,
    { method: 'GET', token },
  );
  return data.result;
}

/**
 * Staff chính thức gửi yêu cầu xin việc.
 * Backend: POST /api/stores/join-by-qr  body: { qr_code }
 */
export async function requestJoinStoreByQr(
  token: string,
  qr_code: string,
): Promise<JoinByQrResponse['result']> {
  const data = await apiRequest<JoinByQrResponse>('/stores/join-by-qr', {
    method: 'POST',
    token,
    body: JSON.stringify({ qr_code }),
  });
  return data.result;
}

