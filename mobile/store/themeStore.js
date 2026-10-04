import { create } from 'zustand';

// Light theme only across AgriVision
export const useThemeStore = create(() => ({
  isDarkMode: false,
  toggleTheme: () => {},
  setTheme: () => {},
  syncWithSystem: () => {},
}));
