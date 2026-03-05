// Android thật: dùng IP LAN của máy tính, không dùng localhost
// iOS Simulator / Android Emulator: có thể dùng localhost hoặc 10.0.2.2
export const API_BASE_URL = 'http://192.168.10.134:3000/api';

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errors?: unknown[],
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /** Trả về các message lỗi field từ backend (ví dụ: "password: must be at least 6 chars") */
  getFieldErrors(): string {
    if (!this.errors || this.errors.length === 0) return this.message;
    return (this.errors as Array<{ msg?: string; path?: string; message?: string }>)
      .map((e) => (e.path ? `${e.path}: ${e.msg ?? e.message}` : (e.msg ?? e.message ?? '')))
      .filter(Boolean)
      .join('\n');
  }
}

/**
 * Callback được đăng ký bởi auth store.
 * Khi apiRequest nhận 401, nó sẽ gọi callback này để lấy access token mới.
 * Nếu callback trả về null thì không thể refresh — throw ApiError 401.
 */
type RefreshCallback = () => Promise<string | null>;
let _refreshCallback: RefreshCallback | null = null;

export function setRefreshTokenCallback(cb: RefreshCallback): void {
  _refreshCallback = cb;
}

interface RequestOptions extends RequestInit {
  token?: string;
  /** Nội bộ: ngăn vòng lặp refresh vô hạn */
  _isRetry?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, headers, _isRetry, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers as Record<string, string>),
    },
    ...rest,
  });

  const json = await response.json();

  // ─ Tự động refresh và retry 1 lần khi 401 ───────────────────────────
  if (response.status === 401 && !_isRetry && _refreshCallback) {
    const newAccessToken = await _refreshCallback();
    if (newAccessToken) {
      return apiRequest<T>(path, { ...options, token: newAccessToken, _isRetry: true });
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, json?.message ?? 'Lỗi không xác định', json?.errors);
  }

  return json as T;
}

/** Decode JWT payload (không verify signature) */
export function decodeJwtPayload<T = Record<string, unknown>>(token: string): T {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload) as T;
  } catch {
    return {} as T;
  }
}
