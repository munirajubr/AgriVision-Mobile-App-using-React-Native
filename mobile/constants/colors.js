// iOS-themed color palette for AgriVision
// Light and Dark mode support with agriculture-friendly green accent

const LIGHT_COLORS = {
  // Primary colors - Agriculture green
  primary: "#34C759", // iOS green
  primaryLight: "#4CD964",
  primaryDark: "#248A3D",
  
  // Backgrounds
  background: "#F2F2F7", // iOS light background
  cardBackground: "#FFFFFF",
  secondaryBackground: "#E5E5EA",
  
  // Text colors
  textPrimary: "#000000",
  textSecondary: "#3C3C43", // iOS secondary text
  textTertiary: "#8E8E93", // iOS tertiary text
  placeholderText: "#C7C7CC",
  
  // Borders and separators
  border: "#E5E5EA",
  separator: "#C6C6C8",
  
  // Status colors
  error: "#FF3B30", // iOS red
  warning: "#FF9500", // iOS orange
  success: "#34C759", // iOS green
  info: "#007AFF", // iOS blue
  
  // UI elements
  inactive: "#C7C7CC",
  shadow: "rgba(0, 0, 0, 0.1)",
  overlay: "rgba(0, 0, 0, 0.4)",
  
  // Fixed colors
  white: "#FFFFFF",
  black: "#000000",
};

const DARK_COLORS = {
  // Primary colors - Agriculture green (adjusted for dark mode)
  primary: "#32D74B", // iOS green dark mode
  primaryLight: "#4CD964",
  primaryDark: "#248A3D",
  
  // Backgrounds
  background: "#000000", // iOS dark background
  cardBackground: "#1C1C1E", // iOS elevated dark
  secondaryBackground: "#2C2C2E",
  
  // Text colors
  textPrimary: "#FFFFFF",
  textSecondary: "#EBEBF5", // iOS secondary text dark
  textTertiary: "#8E8E93", // iOS tertiary text dark
  placeholderText: "#48484A",
  
  // Borders and separators
  border: "#38383A",
  separator: "#48484A",
  
  // Status colors
  error: "#FF453A", // iOS red dark
  warning: "#FF9F0A", // iOS orange dark
  success: "#32D74B", // iOS green dark
  info: "#0A84FF", // iOS blue dark
  
  // UI elements
  inactive: "#48484A",
  shadow: "rgba(0, 0, 0, 0.3)",
  overlay: "rgba(0, 0, 0, 0.6)",
  
  // Fixed colors
  white: "#FFFFFF",
  black: "#000000",
};

// Export function to get colors based on theme
export const getColors = (isDarkMode) => {
  return isDarkMode ? DARK_COLORS : LIGHT_COLORS;
};

// Default export for backward compatibility
export default LIGHT_COLORS;

