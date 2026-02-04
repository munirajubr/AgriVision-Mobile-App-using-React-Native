import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";
import SafeScreen from "../../components/SafeScreen";

const NotificationsPage = () => {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: COLORS.background }]}>
          <Text style={[styles.headerTitle, { color: COLORS.textPrimary }]}>Notifications</Text>
          <Text style={[styles.headerSubtitle, { color: COLORS.textSecondary }]}>
            Stay updated with your farm alerts
          </Text>
        </View>

        {/* Coming Soon Content */}
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: `${COLORS.primary}15` }]}>
            <Ionicons name="notifications-outline" size={80} color={COLORS.primary} />
          </View>
          
          <Text style={[styles.title, { color: COLORS.textPrimary }]}>Coming Soon</Text>
          <Text style={[styles.description, { color: COLORS.textSecondary }]}>
            We're working on bringing you real-time notifications for:
          </Text>

          <View style={styles.featuresList}>
            {[
              { icon: 'warning-outline', text: 'Disease alerts', color: COLORS.error },
              { icon: 'cloud-outline', text: 'Weather warnings', color: COLORS.info },
              { icon: 'trending-up-outline', text: 'Market price updates', color: COLORS.success },
              { icon: 'hardware-chip-outline', text: 'Device status alerts', color: COLORS.warning },
            ].map((feature, index) => (
              <View key={index} style={[styles.featureItem, { backgroundColor: COLORS.cardBackground }]}>
                <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
                  <Ionicons name={feature.icon} size={24} color={feature.color} />
                </View>
                <Text style={[styles.featureText, { color: COLORS.textPrimary }]}>{feature.text}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.footerText, { color: COLORS.textTertiary }]}>
            This feature will be available in the next update
          </Text>
        </View>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  featuresList: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default NotificationsPage;
