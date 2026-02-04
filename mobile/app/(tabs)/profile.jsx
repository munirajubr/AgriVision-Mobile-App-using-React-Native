import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import ProfileHeader from "../../components/ProfileHeader";
import SafeScreen from "../../components/SafeScreen";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  if (!user) {
    return (
      <SafeScreen>
        <View style={[styles.centered, { backgroundColor: COLORS.background }]}>
          <Text style={[styles.errorText, { color: COLORS.error }]}>User not found.</Text>
        </View>
      </SafeScreen>
    );
  }

  const handleRateApp = () => Alert.alert("Rate App", "Thank you for your feedback!");
  const handleContactUs = () => Linking.openURL("mailto:support@agrivision.com?subject=Support Request");
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout }
    ]);
  };

  const menuGroups = [
    {
      title: "App Settings",
      items: [
        { icon: "settings-outline", label: "General Settings", route: "/(pages)/settings", color: COLORS.primary },
        { icon: "notifications-outline", label: "Notifications", route: "/(tabs)/notifications", color: COLORS.warning },
      ]
    },
    {
      title: "Support & Legal",
      items: [
        { icon: "help-circle-outline", label: "Help Center", route: "/(pages)/helpsupport", color: COLORS.info },
        { icon: "document-text-outline", label: "Terms of Service", route: "/(pages)/terms", color: "#9C27B0" },
        { icon: "information-circle-outline", label: "About AgriVision", route: "/(pages)/about", color: COLORS.success },
      ]
    },
    {
      title: "Interaction",
      items: [
        { icon: "star-outline", label: "Rate Us on Store", action: handleRateApp, color: "#FFC107" },
        { icon: "mail-outline", label: "Contact Developer", action: handleContactUs, color: "#E91E63" },
      ]
    }
  ];

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Custom Profile Section */}
          <View style={styles.profileHero}>
            <View style={[styles.avatarBox, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.avatarInitial}>{user.username?.charAt(0).toUpperCase() || "U"}</Text>
            </View>
            <Text style={[styles.userName, { color: COLORS.textPrimary }]}>{user.username || "Farmer"}</Text>
            <Text style={[styles.userEmail, { color: COLORS.textTertiary }]}>{user.email}</Text>
            
            <TouchableOpacity 
              style={[styles.editBtn, { backgroundColor: `${COLORS.primary}15` }]}
              onPress={() => router.push("/(pages)/editprofile")}
            >
              <Text style={[styles.editBtnText, { color: COLORS.primary }]}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats Row */}
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: COLORS.cardBackground }]}>
              <Text style={[styles.statValue, { color: COLORS.textPrimary }]}>{user.farmSize || "N/A"}</Text>
              <Text style={[styles.statLabel, { color: COLORS.textTertiary }]}>Farm Size</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: COLORS.cardBackground }]}>
              <Text style={[styles.statValue, { color: COLORS.textPrimary }]}>{user.experience || "0"}</Text>
              <Text style={[styles.statLabel, { color: COLORS.textTertiary }]}>Years Exp</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: COLORS.cardBackground }]}>
              <Text style={[styles.statValue, { color: COLORS.textPrimary }]}>{user.connectedDevices || "0"}</Text>
              <Text style={[styles.statLabel, { color: COLORS.textTertiary }]}>Devices</Text>
            </View>
          </View>

          {/* Menu Groups */}
          {menuGroups.map((group, gIdx) => (
            <View key={gIdx} style={styles.menuGroup}>
              <Text style={[styles.groupTitle, { color: COLORS.textTertiary }]}>{group.title}</Text>
              <View style={[styles.groupContent, { backgroundColor: COLORS.cardBackground }]}>
                {group.items.map((item, iIdx) => (
                  <TouchableOpacity
                    key={iIdx}
                    style={[styles.menuItem, iIdx !== group.items.length - 1 && styles.menuDivider]}
                    onPress={() => item.action ? item.action() : router.push(item.route)}
                  >
                    <View style={[styles.menuIconBox, { backgroundColor: `${item.color}10` }]}>
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    </View>
                    <Text style={[styles.menuLabel, { color: COLORS.textPrimary }]}>{item.label}</Text>
                    <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Logout Section */}
          <TouchableOpacity 
            style={[styles.logoutBtn, { backgroundColor: `${COLORS.error}10` }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
            <Text style={[styles.logoutText, { color: COLORS.error }]}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={[styles.versionText, { color: COLORS.textTertiary }]}>AgriVision v2.0.0 • Made for Farmers</Text>

          <View style={{ height: 120 }} />
        </ScrollView>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileHero: { alignItems: 'center', marginBottom: 30 },
  avatarBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
      android: { elevation: 5 }
    })
  },
  avatarInitial: { color: '#FFF', fontSize: 40, fontWeight: '700' },
  userName: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  userEmail: { fontSize: 14, fontWeight: '400', marginBottom: 16 },
  editBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  editBtnText: { fontSize: 14, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  statBox: { flex: 1, padding: 16, borderRadius: 24, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', marginBottom: 2 },
  statLabel: { fontSize: 12, fontWeight: '500' },
  menuGroup: { marginBottom: 25 },
  groupTitle: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', marginLeft: 16, marginBottom: 10, letterSpacing: 1 },
  groupContent: { borderRadius: 24, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(0,0,0,0.05)' },
  menuIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: 24, gap: 10, marginTop: 10 },
  logoutText: { fontSize: 16, fontWeight: '700' },
  versionText: { textAlign: 'center', fontSize: 12, marginTop: 30, opacity: 0.5 }
});
