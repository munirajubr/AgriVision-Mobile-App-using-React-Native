// iOS-themed color palette for AgriVision
// Light and Dark mode support with agriculture-friendly green accent

const LIGHT_COLORS = {
  // Primary colors - Nature/Agriculture Green
  primary: "#2E7D32", 
  primaryLight: "#4CAF50",
  primaryDark: "#1B5E20",
  
  // Backgrounds
  background: "#FFFFFF",
  cardBackground: "#FFFFFF",
  secondaryBackground: "#F8F9FB",
  
  // Text colors
  textPrimary: "#1A1A1A",
  textSecondary: "#757575",
  textTertiary: "#9E9E9E",
  placeholderText: "#BDBDBD",
  
  // Borders and separators
  border: "#E0E0E0",
  separator: "#F5F5F5",
  
  // Status colors
  error: "#D32F2F",
  warning: "#FFA000",
  success: "#388E3C",
  info: "#1976D2",
  
  // Pastel backgrounds for categories
  pastelGreen: "#E8F5E9",
  pastelPurple: "#F3E5F5",
  pastelBlue: "#E3F2FD",
  pastelOrange: "#FFF3E0",
  pastelPink: "#FCE4EC",

  // UI elements
  inactive: "#E0E0E0",
  shadow: "rgba(0, 0, 0, 0.08)",
  overlay: "rgba(0, 0, 0, 0.5)",
  
  // Fixed colors
  white: "#FFFFFF",
  black: "#000000",
  google: "#DB4437",
  facebook: "#4267B2",
  twitter: "#1DA1F2",
};

const DARK_COLORS = {
  // Primary colors - Vibrant Green for Dark Mode
  primary: "#4CAF50",
  primaryLight: "#81C784",
  primaryDark: "#388E3C",
  
  // Backgrounds
  background: "#121212",
  cardBackground: "#1E1E1E",
  secondaryBackground: "#2C2C2C",
  
  // Text colors
  textPrimary: "#FFFFFF",
  textSecondary: "#B0B0B0",
  textTertiary: "#757575",
  placeholderText: "#616161",
  
  // Borders and separators
  border: "#333333",
  separator: "#2C2C2C",
  
  // Status colors
  error: "#EF5350",
  warning: "#FFB300",
  success: "#43A047",
  info: "#42A5F5",
  
  // Darker pastel backgrounds for dark mode
  pastelGreen: "#1B2E1B",
  pastelPurple: "#2E1B2E",
  pastelBlue: "#1B232E",
  pastelOrange: "#2E231B",
  pastelPink: "#2E1B23",

  // UI elements
  inactive: "#333333",
  shadow: "rgba(0, 0, 0, 0.5)",
  overlay: "rgba(0, 0, 0, 0.7)",
  
  // Fixed colors
  white: "#FFFFFF",
  black: "#000000",
  google: "#DB4437",
  facebook: "#4267B2",
  twitter: "#1DA1F2",
};

// Export function to get colors based on theme
export const getColors = (isDarkMode) => {
  return isDarkMode ? DARK_COLORS : LIGHT_COLORS;
};

// Default export for backward compatibility
export default LIGHT_COLORS;

