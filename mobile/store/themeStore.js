import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

export const useThemeStore = create(
  persist(
    (set) => ({
      isDarkMode: Appearance.getColorScheme() === 'dark',
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setTheme: (isDark) => set({ isDarkMode: isDark }),
      syncWithSystem: () => set({ isDarkMode: Appearance.getColorScheme() === 'dark' }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
