import { Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { getColors } from "../constants/colors";

export default function LogoutButton() {
  const { logout } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  const confirmLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout(), style: "destructive" },
    ]);
  };

  return (
    <TouchableOpacity onPress={confirmLogout}>
      <Text style={[styles.logoutText, { color: COLORS.white }]}>Logout</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
