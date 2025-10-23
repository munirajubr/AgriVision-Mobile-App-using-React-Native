import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/profile.styles";
import { useAuthStore } from "../../store/authStore";
import LogoutButton from "../../components/LogoutButton";
import ProfileHeader from "../../components/ProfileHeader";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  // Fallback for missing user state
  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>User not found.</Text>
      </View>
    );
  }

  const handleRateApp = () => Alert.alert("Rate App", "Thank you for your feedback!");
  const handleContactUs = () => Linking.openURL("mailto:support@agrivision.com?subject=Support Request");

  const menuItems = [
    { icon: "settings-outline", label: "Settings", route: "/(pages)/settings", color: "#2196F3" },
    { icon: "help-circle-outline", label: "Help & Support", route: "/(pages)/helpsupport", color: "#FF9800" },
    { icon: "information-circle-outline", label: "About App", route: "/(pages)/about", color: "#4CAF50" },
    { icon: "document-text-outline", label: "Terms & Conditions", route: "/(pages)/terms", color: "#9C27B0" },
    { icon: "star-outline", label: "Rate App", action: handleRateApp, color: "#FFC107" },
    { icon: "mail-outline", label: "Contact Us", action: handleContactUs, color: "#00BCD4" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader onEditProfile={() => router.push("/(pages)/editprofile")} />

        {/* CONTACT */}
        <Section title="Contact Information">
          <InfoItem icon="mail-outline" color="#2196F3" label="Email" value={user.email || "Not set"} />
          <Divider />
          <InfoItem icon="call-outline" color="#4CAF50" label="Phone" value={user.phone || "Not set"} />
          <Divider />
          <InfoItem icon="location-outline" color="#FF9800" label="Location" value={user.farmLocation || "Not set"} />
        </Section>

        {/* FARM DETAILS */}
        <Section title="Farm Details">
          <View style={styles.statsGrid}>
            <Stat icon="resize-outline" label="Farm Size" value={user.farmSize || "Not set"} color={COLORS.primary} />
            <Stat icon="time-outline" label="Experience" value={user.experience || "Not set"} color="#4CAF50" />
            <Stat icon="hardware-chip-outline" label="Devices" value={user.connectedDevices ?? 0} color="#2196F3" />
          </View>
          <View style={styles.detailsCard}>
            <DetailItem label="Farming Type" value={user.farmingType || "Not set"} icon="leaf-outline" iconColor="#4CAF50" />
            <Divider />
            <DetailItem label="Soil Type" value={user.soilType || "Not set"} icon="layers-outline" iconColor="#795548" />
            <Divider />
            <DetailItem label="Irrigation" value={user.irrigationType || "Not set"} icon="water-outline" iconColor="#2196F3" />
            <Divider />
            <DetailItem label="Last Harvest" value={user.lastHarvest || "Not set"} icon="calendar-outline" iconColor="#9C27B0" />
          </View>
        </Section>

        {/* CROPS */}
        <Section title="Crops Grown">
          <View style={styles.cropsContainer}>
            {(user.cropsGrown && user.cropsGrown.length ? user.cropsGrown : ["Not set"]).map((crop, idx) => (
              <View key={idx} style={styles.cropChip}>
                <Ionicons name="leaf" size={16} color={COLORS.primary} />
                <Text style={styles.cropText}>{crop}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* MENU */}
        <Section title="App Settings">
          <View style={styles.menuContainer}>
            {menuItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.menuItem}
                onPress={() =>
                  item.action ? item.action() : item.route && router.push(item.route)
                }
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={22} color={COLORS.border} />
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        {/* VERSION */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>AgriVision v1.0.0</Text>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={22} color="#F44336" />
          <LogoutButton />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Subcomponents for neat rendering:

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const InfoItem = ({ icon, color, label, value }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={20} color={color} />
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text>{value}</Text>
    </View>
  </View>
);

const Divider = () => <View style={styles.divider} />;

const Stat = ({ icon, label, value, color }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={28} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const DetailItem = ({ label, value, icon, iconColor }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailItem}>
      <Ionicons name={icon} size={18} color={iconColor} />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);
