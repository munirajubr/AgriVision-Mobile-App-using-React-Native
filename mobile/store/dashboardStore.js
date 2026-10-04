import { create } from 'zustand';

export const useDashboardStore = create((set) => ({
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  // Default Global Weather State for consistency across screens
  weatherData: {
    temp: 28,
    condition: 'Partly Cloudy',
    humidity: 62,
    wind: 14,
    uv: 6,
    icon: 'partly-sunny',
    location: 'Bangalore',
    loading: false
  },
  setWeatherData: (data) => set({ weatherData: { ...data, loading: false } }),

  fetchWeather: async (location) => {
    // Instant offline fallback with rich default weather
    set({
      weatherData: {
        temp: 28,
        condition: 'Partly Cloudy',
        humidity: 62,
        wind: 14,
        uv: 6,
        icon: 'partly-sunny',
        location: location || 'Bangalore',
        loading: false
      }
    });
  },
}));
