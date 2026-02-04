import { create } from 'zustand';

export const useDashboardStore = create((set) => ({
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  // Real-time Global Weather State for consistency across screens
  weatherData: {
    temp: '--',
    condition: 'Loading...',
    humidity: '--',
    wind: '--',
    icon: 'cloud-download-outline',
    loading: true
  },
  setWeatherData: (data) => set({ weatherData: { ...data, loading: false } }),
}));
