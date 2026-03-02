import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, AuthPayload } from '../types';

const AUTH_STORAGE_KEY = '@lopo_auth';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  setAuth: (payload: AuthPayload) => Promise<void>;
  logout: () => Promise<void>;
  hydrateAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  // State
  isAuthenticated: false,
  user: null,
  accessToken: null,

  // Actions
  setAuth: async (payload: AuthPayload) => {
    const { user, accessToken } = payload;
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, accessToken }));
      set({
        isAuthenticated: true,
        user,
        accessToken,
      });
    } catch (error) {
      console.error('Error saving auth:', error);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });
    } catch (error) {
      console.error('Error removing auth:', error);
    }
  },

  hydrateAuth: async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const { user, accessToken } = JSON.parse(stored) as { user: User; accessToken: string };
        set({
          isAuthenticated: true,
          user,
          accessToken,
        });
      }
    } catch (error) {
      console.error('Error hydrating auth:', error);
    }
  },
}));
