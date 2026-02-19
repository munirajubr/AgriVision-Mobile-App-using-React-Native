// iOS-themed color palette for AgriVision
// Light and Dark mode support with agriculture-friendly green accent

const LIGHT_COLORS = {
  // Primary colors - Dark and clean
  primary: "#000000",
  primaryLight: "#333333",
  primaryDark: "#000000",
  
  // Backgrounds
  background: "#FFFFFF",
  cardBackground: "#F8F9FB",
  secondaryBackground: "#F2F2F7",
  
  // Text colors
  textPrimary: "#1A1A1A",
  textSecondary: "#666666",
  textTertiary: "#999999",
  placeholderText: "#C7C7CC",
  
  // Borders and separators
  border: "#EEEEEE",
  separator: "#F2F2F7",
  
  // Status colors
  error: "#FF3B30",
  warning: "#FFCC00",
  success: "#34C759",
  info: "#007AFF",
  
  // Pastel backgrounds for categories
  pastelGreen: "#E6F7ED",
  pastelPurple: "#F4EBFF",
  pastelBlue: "#EBF5FF",
  pastelOrange: "#FFF7E6",
  pastelPink: "#FFF0F5",

  // UI elements
  inactive: "#C7C7CC",
  shadow: "rgba(0, 0, 0, 0.05)",
  overlay: "rgba(0, 0, 0, 0.4)",
  
  // Fixed colors
  white: "#FFFFFF",
  black: "#000000",
};

const DARK_COLORS = {
  // Primary colors - White and clean for dark mode
  primary: "#FFFFFF",
  primaryLight: "#EEEEEE",
  primaryDark: "#FFFFFF",
  
  // Backgrounds
  background: "#000000",
  cardBackground: "#111111",
  secondaryBackground: "#1A1A1A",
  
  // Text colors
  textPrimary: "#FFFFFF",
  textSecondary: "#AAAAAA",
  textTertiary: "#666666",
  placeholderText: "#48484A",
  
  // Borders and separators
  border: "#222222",
  separator: "#1A1A1A",
  
  // Status colors
  error: "#FF453A",
  warning: "#FFD60A",
  success: "#32D74B",
  info: "#0A84FF",
  
  // Darker pastel backgrounds for dark mode
  pastelGreen: "#0F2618",
  pastelPurple: "#1B0F26",
  pastelBlue: "#0F1B26",
  pastelOrange: "#261B0F",
  pastelPink: "#260F1B",

  // UI elements
  inactive: "#3A3A3C",
  shadow: "rgba(0, 0, 0, 0.5)",
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

