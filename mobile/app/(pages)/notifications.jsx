import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";
import SafeScreen from "../../components/SafeScreen";
import PageHeader from "../../components/PageHeader";

const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif_1",
    title: "Critical Soil Moisture Alert",
    message: "Sensor #SL-204 detected low soil moisture (18%). Immediate drip irrigation recommended.",
    timestamp: "10 mins ago",
    category: "Alerts",
    icon: "warning-outline",
    color: "#E53935",
    read: false,
  },
  {
    id: "notif_2",
    title: "Weather Alert: Heavy Rain Expected",
    message: "Monsoon showers expected in Bangalore tomorrow afternoon (15mm). Secure harvesting equipment.",
    timestamp: "1 hour ago",
    category: "Weather",
    icon: "cloud-rain-outline",
    color: "#1E88E5",
    read: false,
  },
  {
    id: "notif_3",
    title: "Mandi Price Increase",
    message: "Onion prices increased by +5.1% in Nasik Mandi today reaching ₹38/kg.",
    timestamp: "3 hours ago",
    category: "Market",
    icon: "trending-up-outline",
    color: "#43A047",
    read: true,
  },
  {
    id: "notif_4",
    title: "Sensor Connected Successfully",
    message: "New IoT hardware sensor #CROP-402 is now online and telemetry streaming is active.",
    timestamp: "Yesterday",
    category: "System",
    icon: "hardware-chip-outline",
    color: "#8E24AA",
    read: true,
  },
  {
    id: "notif_5",
    title: "Fertilizer Schedule Reminder",
    message: "Time for NPK top-dressing for Eggplant plot B. Recommended dosage: 50kg Urea/acre.",
    timestamp: "2 days ago",
    category: "Alerts",
    icon: "leaf-outline",
    color: "#FB8C00",
    read: true,
  },
];

const NotificationsPage = () => {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("All");

  const categories = ["All", "Alerts", "Weather", "Market", "System"];

  const filteredNotifs = notifications.filter(
    (n) => activeTab === "All" || n.category === activeTab
  );

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    Alert.alert("Clear Notifications", "Are you sure you want to clear all notifications?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", style: "destructive", onPress: () => setNotifications([]) },
    ]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <PageHeader 
          title="Notifications" 
          rightComponent={
            notifications.length > 0 ? (
              <TouchableOpacity onPress={markAllRead} style={styles.markReadBtn}>
                <Text style={[styles.markReadText, { color: COLORS.primary }]}>Mark all read</Text>
              </TouchableOpacity>
            ) : null
          }
        />

        {/* Filter Categories */}
        <View style={styles.categoryWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveTab(cat)}
                style={[
                  styles.catChip,
                  { backgroundColor: activeTab === cat ? COLORS.primary : COLORS.cardBackground },
                ]}
              >
                <Text
                  style={[
                    styles.catText,
                    { color: activeTab === cat ? (isDarkMode ? COLORS.black : COLORS.white) : COLORS.textSecondary },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {filteredNotifs.length > 0 ? (
            filteredNotifs.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleRead(item.id)}
                activeOpacity={0.8}
                style={[
                  styles.notifCard,
                  {
                    backgroundColor: COLORS.cardBackground,
                    borderColor: item.read ? 'transparent' : `${COLORS.primary}30`,
                  },
                ]}
              >
                <View style={[styles.iconCircle, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>

                <View style={styles.notifInfo}>
                  <View style={styles.notifTitleRow}>
                    <Text style={[styles.notifTitle, { color: COLORS.textPrimary }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    {!item.read && <View style={[styles.unreadDot, { backgroundColor: COLORS.primary }]} />}
                  </View>
                  <Text style={[styles.notifMessage, { color: COLORS.textSecondary }]}>
                    {item.message}
                  </Text>
                  <Text style={[styles.notifTime, { color: COLORS.textTertiary }]}>
                    {item.timestamp}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIconCircle, { backgroundColor: `${COLORS.textTertiary}15` }]}>
                <Ionicons name="notifications-off-outline" size={60} color={COLORS.textTertiary} />
              </View>
              <Text style={[styles.emptyTitle, { color: COLORS.textPrimary }]}>No Notifications</Text>
              <Text style={[styles.emptySub, { color: COLORS.textTertiary }]}>
                You're all caught up! Check back later for fresh farm updates.
              </Text>
            </View>
          )}

          {notifications.length > 0 && (
            <TouchableOpacity onPress={clearAll} style={styles.clearBtn}>
              <Ionicons name="trash-outline" size={16} color={COLORS.error} />
              <Text style={[styles.clearBtnText, { color: COLORS.error }]}>Clear all notifications</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  markReadBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  markReadText: { fontSize: 13, fontWeight: "700" },
  categoryWrapper: { marginBottom: 12 },
  categoryContainer: { paddingHorizontal: 20, gap: 8 },
  catChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 16 },
  catText: { fontSize: 13, fontWeight: "700" },
  notifCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 22,
    marginBottom: 12,
    borderWidth: 1,
    gap: 14,
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  notifInfo: { flex: 1 },
  notifTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notifTitle: { fontSize: 15, fontWeight: "800", flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
  notifMessage: { fontSize: 13, fontWeight: "500", lineHeight: 18, marginBottom: 6 },
  notifTime: { fontSize: 11, fontWeight: "600" },
  emptyState: { alignItems: "center", paddingVertical: 80, gap: 16 },
  emptyIconCircle: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontSize: 20, fontWeight: "800" },
  emptySub: { fontSize: 14, textAlign: "center", paddingHorizontal: 40 },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    marginTop: 10,
  },
  clearBtnText: { fontSize: 14, fontWeight: "700" },
});

export default NotificationsPage;
