import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, AuthPayload } from '../types';
import { logout as apiLogout, refreshTokens as apiRefreshTokens } from '../features/auth/services/auth.service';
import { setRefreshTokenCallback } from '../lib/api/client';

const AUTH_STORAGE_KEY = '@lopo_auth';

/** Xóa auth khỏi storage và reset state — không gọi API */
async function clearAuthLocally(
  set: (state: Partial<AuthState>) => void,
): Promise<void> {
  try {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    set({ isAuthenticated: false, user: null, accessToken: null, refreshToken: null });
  } catch (error) {
    console.error('Error removing auth:', error);
  }
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (payload: AuthPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<string | null>;
  hydrateAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // State
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,

  // Actions
  setAuth: async (payload: AuthPayload) => {
    const { user, accessToken, refreshToken = null } = payload;
    try {
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user, accessToken, refreshToken }),
      );
      set({ isAuthenticated: true, user, accessToken, refreshToken });
    } catch (error) {
      console.error('Error saving auth:', error);
    }
  },

  logout: async () => {
    const { accessToken, refreshToken } = get();
    // Gọi API hủy token trên server trước khi xóa local
    if (accessToken && refreshToken) {
      try {
        await apiLogout(accessToken, refreshToken);
      } catch {
        // Bỏ qua lỗi mạng hoặc token đã hết hạn — local state vẫn được xóa bên dưới
      }
    }
    await clearAuthLocally(set);
  },

  refreshTokens: async (): Promise<string | null> => {
    const { refreshToken } = get();
    if (!refreshToken) return null;
    try {
      const tokens = await apiRefreshTokens(refreshToken);
      await AsyncStorage.mergeItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }),
      );
      set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
      return tokens.accessToken;
    } catch {
      // Refresh token hết hạn → chỉ xóa local, không cố gọi API logout bằng token đã hết hạn
      await clearAuthLocally(set);
      return null;
    }
  },

  hydrateAuth: async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const { user, accessToken, refreshToken } = JSON.parse(stored) as {
          user: User;
          accessToken: string;
          refreshToken: string | null;
        };
        set({ isAuthenticated: true, user, accessToken, refreshToken: refreshToken ?? null });
      }
    } catch (error) {
      console.error('Error hydrating auth:', error);
    }
  },
}));

// Đăng ký interceptor: khi apiRequest gặp 401, tự động lấy token mới từ store
setRefreshTokenCallback(() => useAuthStore.getState().refreshTokens());
