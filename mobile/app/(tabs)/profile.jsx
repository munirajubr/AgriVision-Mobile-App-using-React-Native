import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/profile.styles";
import { useAuthStore } from "../../store/authStore";
import { Image } from "expo-image";
import LogoutButton from "../../components/LogoutButton";
import ProfileHeader from "../../components/ProfileHeader";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleRateApp = () => Alert.alert("Rate App", "Thank you for your feedback!");
  const handleContactUs = () =>
    Linking.openURL("mailto:support@agrivision.com?subject=Support Request");

  const menuItems = [
    { icon: "settings-outline", label: "Settings", route: "/(pages)/settings", color: "#2196F3" },
    { icon: "help-circle-outline", label: "Help & Support", route: "/(pages)/helpsupport", color: "#FF9800" },
    { icon: "information-circle-outline", label: "About App", route: "/(pages)/about", color: "#4CAF50" },
    { icon: "document-text-outline", label: "Terms & Conditions", route: "/(pages)/terms", color: "#9C27B0" },
    { icon: "star-outline", label: "Rate App", action: handleRateApp, color: "#FFC107" },
    { icon: "mail-outline", label: "Contact Us", action: handleContactUs, color: "#00BCD4" },
  ];

  if (!user) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader onEditProfile={() => router.push("/(pages)/editprofile")} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <InfoItem icon="mail-outline" color="#2196F3" label="Email" value={user.email} />
            <Divider />
            <InfoItem icon="call-outline" color="#4CAF50" label="Phone" value={user.phone} />
            <Divider />
            <InfoItem icon="location-outline" color="#FF9800" label="Location" value={user.farmLocation} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farm Details</Text>
          <View style={styles.statsGrid}>
            <Stat icon="resize-outline" label="Farm Size" value={user.farmSize} color={COLORS.primary} />
            <Stat icon="time-outline" label="Experience" value={user.experience} color="#4CAF50" />
            <Stat icon="hardware-chip-outline" label="Devices" value={user.connectedDevices ?? 0} color="#2196F3" />
          </View>
          <View style={styles.detailsCard}>
            <DetailItem label="Farming Type" value={user.farmingType} icon="leaf-outline" iconColor="#4CAF50" />
            <Divider />
            <DetailItem label="Soil Type" value={user.soilType} icon="layers-outline" iconColor="#795548" />
            <Divider />
            <DetailItem label="Irrigation" value={user.irrigationType} icon="water-outline" iconColor="#2196F3" />
            <Divider />
            <DetailItem label="Last Harvest" value={user.lastHarvest} icon="calendar-outline" iconColor="#9C27B0" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crops Grown</Text>
          <View style={styles.cropsContainer}>
            {(user.cropsGrown ?? []).map((crop, index) => (
              <View key={index} style={styles.cropChip}>
                <Ionicons name="leaf" size={16} color={COLORS.primary} />
                <Text style={styles.cropText}>{crop}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
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
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>AgriVision v1.0.0</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={22} color="#F44336" />
          <LogoutButton />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const InfoItem = ({ icon, color, label, value }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={20} color={color} />
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
