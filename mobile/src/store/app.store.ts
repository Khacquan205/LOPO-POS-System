import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HAS_LAUNCHED_KEY = '@lopo_has_launched';

interface AppState {
  hasLaunched: boolean;
  isHydrated: boolean;
  hydrateLaunchFlag: () => Promise<void>;
  setHasLaunchedTrue: () => Promise<void>;
  resetLaunchFlag: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  // State
  hasLaunched: false,
  isHydrated: false,

  // Actions
  hydrateLaunchFlag: async () => {
    try {
      const value = await AsyncStorage.getItem(HAS_LAUNCHED_KEY);
      set({
        hasLaunched: value === '1',
        isHydrated: true,
      });
    } catch (error) {
      console.error('Error hydrating launch flag:', error);
      set({ isHydrated: true });
    }
  },

  setHasLaunchedTrue: async () => {
    try {
      await AsyncStorage.setItem(HAS_LAUNCHED_KEY, '1');
      set({ hasLaunched: true });
    } catch (error) {
      console.error('Error setting hasLaunched:', error);
    }
  },

  resetLaunchFlag: async () => {
    try {
      await AsyncStorage.removeItem(HAS_LAUNCHED_KEY);
      set({ hasLaunched: false });
    } catch (error) {
      console.error('Error resetting launch flag:', error);
    }
  },
}));
