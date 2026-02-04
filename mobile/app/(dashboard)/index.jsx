import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Image, Platform } from 'react-native';
import Card from '../../components/Card';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { useDashboardStore } from '../../store/dashboardStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Home() {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const { user } = useAuthStore();
  const { setActiveTab } = useDashboardStore();
  const router = useRouter();

  const handleWeatherPress = () => {
    router.push('/(tabs)/weather');
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Premium Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroLeft}>
            <Text style={[styles.greetingText, { color: COLORS.textTertiary }]}>GOOD MORNING,</Text>
            <Text style={[styles.userName, { color: COLORS.textPrimary }]}>{user?.username || "Farmer"} 👋</Text>
          </View>
          <TouchableOpacity 
            style={[styles.profileButton, { backgroundColor: COLORS.cardBackground }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={[styles.avatarSmall, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.avatarText}>{user?.username?.charAt(0).toUpperCase() || "U"}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Dynamic Weather Dashboard Card */}
        <TouchableOpacity 
          style={[styles.weatherCard, { backgroundColor: COLORS.cardBackground }]}
          activeOpacity={0.9}
          onPress={handleWeatherPress}
        >
          <View style={styles.weatherMain}>
            <View>
              <Text style={[styles.weatherLabel, { color: COLORS.textTertiary }]}>OUTDOOR TEMPERATURE</Text>
              <View style={styles.tempRow}>
                <Text style={[styles.tempMain, { color: COLORS.textPrimary }]}>28°</Text>
                <Text style={[styles.tempUnit, { color: COLORS.textTertiary }]}>C</Text>
              </View>
              <Text style={[styles.weatherCondition, { color: COLORS.primary }]}>Mostly Sunny • Clear Sky</Text>
            </View>
            <View style={[styles.weatherIconContainer, { backgroundColor: `${COLORS.warning}15` }]}>
              <Ionicons name="sunny" size={42} color={COLORS.warning} />
            </View>
          </View>
          <View style={[styles.weatherDivider, { backgroundColor: COLORS.secondaryBackground }]} />
          <View style={styles.weatherStats}>
            <View style={styles.weatherStatItem}>
              <Ionicons name="water-outline" size={16} color={COLORS.info} />
              <Text style={[styles.weatherStatText, { color: COLORS.textSecondary }]}>62% Humidity</Text>
            </View>
            <View style={styles.weatherStatItem}>
              <Ionicons name="leaf-outline" size={16} color={COLORS.success} />
              <Text style={[styles.weatherStatText, { color: COLORS.textSecondary }]}>8 km/h Wind</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Visual Hierarchy: Subtitles and Grids */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Quick Actions</Text>
        </View>
        
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <Card
              variant="box"
              icon="analytics-outline"
              title="Analysis"
              subtitle="Soil Health"
              link="/(pages)/npkupload"
            />
            <Card
              variant="box"
              icon="leaf-outline"
              title="Guides"
              subtitle="Crop Tips"
              link="/(pages)/cropguide"
            />
          </View>
          <View style={styles.gridRow}>
            <Card
              variant="box"
              icon="flask-outline"
              title="Advisor"
              subtitle="Fertilizer"
              link="/(pages)/fertilizerguide"
            />
            <Card
              variant="box"
              icon="pulse-outline"
              title="Status"
              subtitle="Real-time"
              onPress={() => setActiveTab('devices')}
            />
          </View>
        </View>
      </ScrollView>

      {/* Primary Access Floating Button */}
      <View style={styles.fixedBottomContainer}>
        <TouchableOpacity 
          style={[styles.floatingBanner, { backgroundColor: COLORS.primary }]}
          activeOpacity={0.9}
          onPress={() => router.push('/(pages)/diagnosis')}
        >
          <View style={styles.bannerLeft}>
            <View style={styles.bannerIconCircle}>
              <Ionicons name="scan" size={24} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>Instant Disease Detection</Text>
              <Text style={styles.bannerSub}>Identify issues in seconds with AI Vision</Text>
            </View>
          </View>
          <Ionicons name="arrow-forward-circle" size={32} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 160,
  },
  heroSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  heroLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
  },
  profileButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    padding: 4,
  },
  avatarSmall: {
    width: '100%',
    height: '100%',
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  weatherCard: {
    borderRadius: 30,
    padding: 24,
    marginBottom: 32,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20 },
      android: { elevation: 3 },
    }),
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  weatherLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tempMain: {
    fontSize: 54,
    fontWeight: '800',
    lineHeight: 54,
  },
  tempUnit: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 6,
    marginLeft: 4,
  },
  weatherCondition: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  weatherIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherDivider: {
    height: 1,
    width: '100%',
    opacity: 0.5,
    marginBottom: 20,
  },
  weatherStats: {
    flexDirection: 'row',
    gap: 20,
  },
  weatherStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weatherStatText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
  },
  gridContainer: {
    gap: 16,
    marginBottom: 32,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 16,
  },
  fixedBottomContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  floatingBanner: {
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 20 },
      android: { elevation: 10 },
    }),
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  bannerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  bannerSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
