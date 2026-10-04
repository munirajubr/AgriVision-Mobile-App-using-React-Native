// NeoFarm Modern Agricultural Color System
// Clean, organic, high-contrast aesthetics with forest greens and vibrant lime accents

const LIGHT_COLORS = {
  // Primary brand colors
  primary: "#1A4D2E", 
  primaryLight: "#2D6A4F",
  primaryDark: "#0E301B",
  accent: "#84CC16",
  accentLime: "#A3E635",
  accentSoft: "#D9F99D",
  limeCard: "#D7F78A",
  limeCardText: "#0F3819",
  
  // Backgrounds
  background: "#F4F7F4",
  cardBackground: "#FFFFFF",
  secondaryBackground: "#EBF1EB",
  subtleCard: "#FAFCFA",
  dockBackground: "#132317",
  dockActive: "#1F3B27",
  
  // Text colors
  textPrimary: "#111813",
  textSecondary: "#4B5563",
  textTertiary: "#94A3B8",
  textMuted: "#64748B",
  placeholderText: "#9CA3AF",
  
  // Borders and separators
  border: "rgba(0, 0, 0, 0.06)",
  separator: "rgba(0, 0, 0, 0.04)",
  glassBorder: "rgba(255, 255, 255, 0.3)",
  glassBg: "rgba(255, 255, 255, 0.2)",
  glassDarkBg: "rgba(0, 0, 0, 0.35)",
  
  // Status & Badges
  error: "#EF4444",
  warning: "#F59E0B",
  success: "#10B981",
  info: "#0EA5E9",
  
  // Pastel backgrounds for categories
  pastelGreen: "#EBF7EE",
  pastelPurple: "#F3E8FF",
  pastelBlue: "#E0F2FE",
  pastelOrange: "#FEF3C7",
  pastelPink: "#FCE7F3",

  // UI elements
  inactive: "#E2E8F0",
  shadow: "rgba(0, 0, 0, 0.06)",
  overlay: "rgba(10, 20, 12, 0.5)",
  
  // Fixed colors
  white: "#FFFFFF",
  black: "#000000",
  google: "#DB4437",
  facebook: "#4267B2",
  twitter: "#1DA1F2",
};

const DARK_COLORS = {
  // Primary brand colors
  primary: "#84CC16",
  primaryLight: "#A3E635",
  primaryDark: "#4D7C0F",
  accent: "#A3E635",
  accentLime: "#BEF264",
  accentSoft: "#365314",
  limeCard: "#1D3A1B",
  limeCardText: "#BEF264",
  
  // Backgrounds
  background: "#0D1610",
  cardBackground: "#152219",
  secondaryBackground: "#1B2E21",
  subtleCard: "#18271D",
  dockBackground: "#09100B",
  dockActive: "#1A3320",
  
  // Text colors
  textPrimary: "#F8FAFC",
  textSecondary: "#CBD5E1",
  textTertiary: "#64748B",
  textMuted: "#94A3B8",
  placeholderText: "#64748B",
  
  // Borders and separators
  border: "rgba(255, 255, 255, 0.08)",
  separator: "rgba(255, 255, 255, 0.05)",
  glassBorder: "rgba(255, 255, 255, 0.15)",
  glassBg: "rgba(255, 255, 255, 0.08)",
  glassDarkBg: "rgba(0, 0, 0, 0.6)",
  
  // Status & Badges
  error: "#F87171",
  warning: "#FBBF24",
  success: "#34D399",
  info: "#38BDF8",
  
  // Pastel backgrounds for categories
  pastelGreen: "#132E1C",
  pastelPurple: "#2A183D",
  pastelBlue: "#102C40",
  pastelOrange: "#3D2B12",
  pastelPink: "#3D1728",

  // UI elements
  inactive: "#1E293B",
  shadow: "rgba(0, 0, 0, 0.5)",
  overlay: "rgba(0, 0, 0, 0.8)",
  
  // Fixed colors
  white: "#FFFFFF",
  black: "#000000",
  google: "#DB4437",
  facebook: "#4267B2",
  twitter: "#1DA1F2",
};

// Export function to get colors based on theme (Light Theme Only)
export const getColors = () => {
  return LIGHT_COLORS;
};

// Default export for backward compatibility
export default LIGHT_COLORS;
