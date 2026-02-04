import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";
import SafeScreen from "../../components/SafeScreen";
import PageHeader from "../../components/PageHeader";

const NotificationsPage = () => {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  // standard "Coming Soon" features matching the Help Center's section style
  const features = [
    { icon: 'warning-outline', text: 'Disease alerts', color: COLORS.error },
    { icon: 'cloud-outline', text: 'Weather warnings', color: COLORS.info },
    { icon: 'trending-up-outline', text: 'Market price updates', color: COLORS.success },
    { icon: 'hardware-chip-outline', text: 'Device status alerts', color: COLORS.warning },
  ];

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <PageHeader title="Notifications" />
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Hero Visual matching Help Center */}
          <View style={styles.headerHero}>
            <View style={[styles.iconCircle, { backgroundColor: `${COLORS.primary}10` }]}>
              <Ionicons name="notifications" size={40} color={COLORS.primary} />
            </View>
            <Text style={[styles.heroTitle, { color: COLORS.textPrimary }]}>Notifications</Text>
            <Text style={[styles.heroSub, { color: COLORS.textTertiary }]}>Stay updated with your farm alerts</Text>
          </View>

          {/* Features Section matching Help Center standard */}
          <View style={styles.section}>
            <Text style={[styles.secTitle, { color: COLORS.textPrimary }]}>Coming Soon</Text>
            <Text style={[styles.secDesc, { color: COLORS.textSecondary }]}>
              We're working on bringing you real-time notifications for:
            </Text>
            
            <View style={styles.featureList}>
              {features.map((item, i) => (
                <View key={i} style={[styles.featureCard, { backgroundColor: COLORS.cardBackground }]}>
                  <View style={[styles.miniCircle, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons name={item.icon} size={24} color={item.color} />
                  </View>
                  <View style={styles.featureInfo}>
                    <Text style={[styles.featureText, { color: COLORS.textPrimary }]}>{item.text}</Text>
                    <Text style={[styles.statusText, { color: COLORS.textTertiary }]}>Development in progress</Text>
                  </View>
                  <Ionicons name="lock-closed-outline" size={16} color={COLORS.textTertiary} />
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  headerHero: { alignItems: 'center', marginVertical: 30 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  heroTitle: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  heroSub: { fontSize: 15, fontWeight: '500' },
  section: { gap: 16 },
  secTitle: { fontSize: 19, fontWeight: '800', paddingLeft: 8 },
  secDesc: { fontSize: 14, fontWeight: '500', paddingLeft: 8, marginTop: -8, lineHeight: 20 },
  featureList: { gap: 12 },
  featureCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 24, 
    ...Platform.select({ 
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 }, 
      android: { elevation: 2 } 
    }) 
  },
  miniCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  featureInfo: { flex: 1 },
  featureText: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  statusText: { fontSize: 12, fontWeight: '500' }
});

export default NotificationsPage;
