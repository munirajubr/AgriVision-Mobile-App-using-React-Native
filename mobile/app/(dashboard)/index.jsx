import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getColors } from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { useDashboardStore } from '../../store/dashboardStore';

const { width } = Dimensions.get('window');

// High quality agricultural field images
const HERO_FIELD_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop';
const SATELLITE_FIELD_IMAGE = 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000&auto=format&fit=crop';

export default function Home() {
  const COLORS = getColors();
  const { user } = useAuthStore();
  const { weatherData } = useDashboardStore();
  const router = useRouter();

  useEffect(() => {
    if (weatherData.loading && user?.farmLocation) {
      useDashboardStore.getState().fetchWeather(user.farmLocation);
    }
  }, [user?.farmLocation, weatherData.loading]);

  const firstName = user?.fullName?.split(' ')[0] || 'Farmer';
  const locationText = user?.farmLocation || 'Sawojajar, Jawa Timur';

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP NAV BAR — reference style: circular ghost buttons, location center, notif bell */}
        <View style={styles.topNavBar}>
          <TouchableOpacity
            style={styles.topNavBtn}
            onPress={() => router.push('/(pages)/settings')}
            activeOpacity={0.7}
          >
            <Ionicons name="options-outline" size={20} color="#111411" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topNavLocation}
            onPress={() => router.push('/(tabs)/weather')}
            activeOpacity={0.8}
          >
            <Text style={styles.topNavLocationText} numberOfLines={1}>{locationText}</Text>
            <Ionicons name="chevron-down" size={13} color="#111411" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topNavBtn}
            onPress={() => router.push('/(pages)/notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color="#111411" />
            <View style={styles.topNavNotifDot} />
          </TouchableOpacity>
        </View>

        {/* 1. HERO SECTION */}
        <View style={styles.heroWrapper}>
          <ImageBackground
            source={{ uri: HERO_FIELD_IMAGE }}
            style={styles.heroBackground}
            imageStyle={styles.heroImageStyle}
          >
            <LinearGradient
              colors={['rgba(8, 20, 10, 0.4)', 'rgba(10, 25, 12, 0.25)', 'rgba(8, 20, 10, 0.75)']}
              style={styles.heroGradient}
            >

              {/* Greeting & Live Temperature Banner */}
              <View style={styles.heroWeatherBlock}>
                <Text style={styles.greetingSub}>Hi, Good Morning {firstName} 👋</Text>
                
                <View style={styles.tempConditionRow}>
                  <Text style={styles.mainTemperature}>
                    {weatherData.temp ? `${weatherData.temp}°C` : '26°C'}
                  </Text>
                  
                  <View style={styles.conditionColumn}>
                    <View style={styles.conditionBadge}>
                      <Ionicons name="sunny-outline" size={16} color="#FFD700" />
                      <Text style={styles.conditionText}>
                        {weatherData.condition || 'Sunny Day'}
                      </Text>
                    </View>
                    <Text style={styles.dateTimeText}>8:45 AM | Jan 26</Text>
                  </View>
                </View>

                {/* Frosted Micro-Metric Pills */}
                <View style={styles.microPillsRow}>
                  <View style={styles.microPill}>
                    <Ionicons name="paper-plane-outline" size={13} color="#FFFFFF" />
                    <Text style={styles.microPillText}>
                      {weatherData.wind ? `${weatherData.wind} km/h` : '5 km/h'}
                    </Text>
                  </View>

                  <View style={styles.microPill}>
                    <Ionicons name="thermometer-outline" size={13} color="#FFFFFF" />
                    <Text style={styles.microPillText}>+12°C</Text>
                  </View>

                  <View style={styles.microPill}>
                    <Ionicons name="water-outline" size={13} color="#FFFFFF" />
                    <Text style={styles.microPillText}>
                      {weatherData.humidity ? `${weatherData.humidity}%` : '42.5%'}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* 2. QUICK ACTIONS — single clean row, icon + label only */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Quick Actions</Text>
            <TouchableOpacity onPress={() => router.push('/(pages)/all-tools')}>
              <Text style={[styles.sectionLink, { color: COLORS.primary }]}>All Tools</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.qaChip}
              onPress={() => router.push('/(pages)/diagnosis')}
              activeOpacity={0.75}
            >
              <Ionicons name="scan" size={22} color="#3D5247" />
              <Text style={styles.qaLabel}>Scan Plant</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.qaChip}
              onPress={() => router.push('/(pages)/npkupload')}
              activeOpacity={0.75}
            >
              <Ionicons name="analytics" size={22} color="#3D5247" />
              <Text style={styles.qaLabel}>Soil NPK</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.qaChip}
              onPress={() => router.push('/(pages)/cropguide')}
              activeOpacity={0.75}
            >
              <Ionicons name="leaf" size={22} color="#3D5247" />
              <Text style={styles.qaLabel}>Crop Guide</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.qaChip}
              onPress={() => router.push('/(pages)/fertilizerguide')}
              activeOpacity={0.75}
            >
              <Ionicons name="flask" size={22} color="#3D5247" />
              <Text style={styles.qaLabel}>Fertilizer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. TODAY'S SCHEDULE / FIELD ACTIVITIES (Horizontal Cards matching Image 2) */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Field Schedule</Text>
            <TouchableOpacity onPress={() => router.push('/(pages)/notifications')}>
              <Text style={[styles.sectionLink, { color: COLORS.primary }]}>View all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scheduleCardsScroll}
          >
            {/* Lime Card (On-Progress) */}
            <View style={[styles.scheduleCard, styles.scheduleCardActive]}>
              <View style={styles.scheduleCardTop}>
                <Ionicons name="time-outline" size={15} color="#164E2E" />
                <Text style={styles.scheduleTimeActive}>7:30 AM</Text>
              </View>
              <Text style={styles.scheduleTitleActive} numberOfLines={2}>
                Watering of fields CD5
              </Text>
              <View style={styles.statusPillActive}>
                <Text style={styles.statusPillActiveText}>On-Progress</Text>
              </View>
            </View>

            {/* Crisp White Card (Not-Started) */}
            <View style={[styles.scheduleCard, { backgroundColor: COLORS.cardBackground, borderColor: COLORS.border }]}>
              <View style={styles.scheduleCardTop}>
                <Ionicons name="time-outline" size={15} color={COLORS.textTertiary} />
                <Text style={[styles.scheduleTime, { color: COLORS.textSecondary }]}>8:00 AM</Text>
              </View>
              <Text style={[styles.scheduleTitle, { color: COLORS.textPrimary }]} numberOfLines={2}>
                Planting of fields CD5
              </Text>
              <View style={[styles.statusPill, { backgroundColor: COLORS.dockBackground }]}>
                <Text style={styles.statusPillText}>Not-Started</Text>
              </View>
            </View>

            {/* White Card (Inspection) */}
            <View style={[styles.scheduleCard, { backgroundColor: COLORS.cardBackground, borderColor: COLORS.border }]}>
              <View style={styles.scheduleCardTop}>
                <Ionicons name="scan-outline" size={15} color={COLORS.textTertiary} />
                <Text style={[styles.scheduleTime, { color: COLORS.textSecondary }]}>11:30 AM</Text>
              </View>
              <Text style={[styles.scheduleTitle, { color: COLORS.textPrimary }]} numberOfLines={2}>
                AI Drone Crop Scan
              </Text>
              <View style={[styles.statusPill, { backgroundColor: COLORS.secondaryBackground }]}>
                <Text style={[styles.statusPillText, { color: COLORS.textSecondary }]}>Scheduled</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* 4. WATER EFFICIENCY (Segmented Bars matching Image 1 middle) */}
        <View style={styles.sectionBlock}>
          <View style={[styles.metricCard, { backgroundColor: COLORS.cardBackground, borderColor: COLORS.border }]}>
            <View style={styles.metricCardHeader}>
              <Text style={[styles.metricCardTitle, { color: COLORS.textPrimary }]}>Water Efficiency</Text>
              <View style={styles.highBadge}>
                <Text style={styles.highBadgeText}>High 75%</Text>
              </View>
            </View>

            {/* Segmented Micro Bars */}
            <View style={styles.barSegmentsRow}>
              {[...Array(20)].map((_, i) => {
                const isFilled = i < 15;
                return (
                  <View 
                    key={i} 
                    style={[
                      styles.microBarSegment, 
                      { 
                        backgroundColor: isFilled ? '#185226' : '#E2E8F0',
                        height: 28,
                      }
                    ]} 
                  />
                );
              })}
            </View>
            <Text style={[styles.barCaption, { color: COLORS.textSecondary }]}>
              Optimized irrigation across active sectors
            </Text>
          </View>
        </View>

        {/* 5. DUAL HEALTH CARDS (Soil Health & Crop Health Score matching Image 1 middle) */}
        <View style={styles.sectionBlock}>
          <View style={styles.dualCardsRow}>
            {/* Left Card: Soil Health */}
            <TouchableOpacity 
              style={[styles.halfCard, { backgroundColor: COLORS.cardBackground, borderColor: COLORS.border }]}
              onPress={() => router.push('/(pages)/npkupload')}
              activeOpacity={0.8}
            >
              <View style={styles.halfCardHeader}>
                <Text style={[styles.halfCardTitle, { color: COLORS.textPrimary }]}>Soil Health</Text>
                <View style={styles.normalPill}>
                  <Text style={styles.normalPillText}>Normal</Text>
                </View>
              </View>
              
              <Text style={[styles.soilPhValue, { color: COLORS.textPrimary }]}>pH: 6.5, Optimal</Text>
              
              <View style={styles.soilTrendRow}>
                <Ionicons name="trending-up" size={14} color="#16A34A" />
                <Text style={styles.soilTrendText}>+42% Last Week</Text>
              </View>
            </TouchableOpacity>

            {/* Right Card: Crop Health Score */}
            <TouchableOpacity 
              style={[styles.halfCard, { backgroundColor: COLORS.cardBackground, borderColor: COLORS.border }]}
              onPress={() => router.push('/(pages)/diagnosis')}
              activeOpacity={0.8}
            >
              <Text style={[styles.halfCardTitle, { color: COLORS.textPrimary }]}>Crop Health Score</Text>
              
              <View style={styles.radialGaugeContainer}>
                <View style={styles.semiCircleRing}>
                  <Ionicons name="leaf" size={24} color="#16A34A" />
                </View>
                <Text style={[styles.scoreValue, { color: COLORS.textPrimary }]}>85/100</Text>
                <Text style={[styles.scoreLabel, { color: COLORS.textTertiary }]}>Good Condition</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. OUR AGRICULTURE FIELD / AR SATELLITE (Matching Image 1 bottom & Image 2) */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Our agriculture field</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/weather')}>
              <Text style={[styles.sectionLink, { color: COLORS.primary }]}>View Map</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.fieldCardContainer, { backgroundColor: COLORS.cardBackground, borderColor: COLORS.border }]}>
            {/* Aerial Field Image with AR Plot Pins */}
            <View style={styles.satelliteImageWrapper}>
              <Image 
                source={{ uri: SATELLITE_FIELD_IMAGE }}
                style={styles.satelliteImage}
              />
              
              {/* AR Plot Badges */}
              <View style={[styles.arTagPill, { top: 20, left: 24 }]}>
                <Text style={styles.arTagHectares}>2.2ha</Text>
                <Text style={styles.arTagName}>Lettuce Field</Text>
              </View>

              <View style={[styles.arTagPill, { top: 40, right: 30 }]}>
                <Text style={styles.arTagHectares}>1.2ha</Text>
                <Text style={styles.arTagName}>Tomatoes Field</Text>
              </View>

              {/* Service attribution badge */}
              <View style={styles.satelliteBadge}>
                <Ionicons name="sparkles" size={12} color="#A3E635" />
                <Text style={styles.satelliteBadgeText}>Generated by Satellite imagery</Text>
              </View>
            </View>

            {/* Field Plot Details */}
            <View style={styles.fieldCardInfo}>
              <View style={styles.fieldInfoTitleRow}>
                <Text style={[styles.fieldName, { color: COLORS.textPrimary }]}>
                  Rice Field Premium Plot R8
                </Text>
                <View style={styles.harvestPill}>
                  <Text style={styles.harvestPillText}>Towards Harvest</Text>
                </View>
              </View>

              <Text style={[styles.fieldCoords, { color: COLORS.textTertiary }]}>
                7°47'44.1"S, 110°22'10.2"E
              </Text>

              <View style={styles.fieldMetaRow}>
                <View style={styles.fieldMetaItem}>
                  <Ionicons name="cube-outline" size={15} color={COLORS.primary} />
                  <Text style={[styles.fieldMetaText, { color: COLORS.textSecondary }]}>6.2 ha</Text>
                </View>

                <View style={styles.fieldMetaItem}>
                  <Ionicons name="clipboard-outline" size={15} color={COLORS.primary} />
                  <Text style={[styles.fieldMetaText, { color: COLORS.textSecondary }]}>12 Activities</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Extra Bottom Padding for Floating Liquid Dock & Tab Bar */}
        <View style={{ height: 160 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // ── Reference-style Clean Top Navigation Bar ──
  topNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F7F8F7',
  },
  topNavBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEEFEE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  topNavLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topNavLocationText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111411',
  },
  topNavNotifDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    position: 'absolute',
    top: 9,
    right: 10,
    borderWidth: 1.5,
    borderColor: '#F7F8F7',
  },

  // Hero Section
  heroWrapper: {
    width: '100%',
    height: 310,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  heroBackground: {
    width: '100%',
    height: '100%',
  },
  heroImageStyle: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroGradient: {
    flex: 1,
    paddingTop: 18,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 22,
  },
  heroTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  frostedIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    maxWidth: width * 0.55,
  },
  locationPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1E3C27',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#A3E635',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  onlineBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Hero Weather Content
  heroWeatherBlock: {
    marginTop: 'auto',
  },
  greetingSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  tempConditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  mainTemperature: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  conditionColumn: {
    alignItems: 'flex-end',
  },
  conditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  conditionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6,
  },
  dateTimeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  microPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  microPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  microPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },

  // General Section Blocks
  sectionBlock: {
    paddingHorizontal: 20,
    marginTop: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  quickBadge: {
    backgroundColor: '#D9F99D',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  quickBadgeText: {
    color: '#1A4D2E',
    fontSize: 11,
    fontWeight: '800',
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Easy Action Chips
  quickChipsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 10,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    gap: 5,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Easy Action Cards Grid
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  toolCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 146,
    shadowColor: '#1A4D2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  toolIconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  toolTitle: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 19,
    marginBottom: 2,
  },
  toolSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  actionArrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  actionTag: {
    fontSize: 11,
    fontWeight: '800',
  },

  // Schedule Cards
  scheduleCardsScroll: {
    gap: 12,
    paddingRight: 10,
  },
  scheduleCard: {
    width: 175,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 148,
  },
  scheduleCardActive: {
    backgroundColor: '#C8F572',
    borderColor: '#B0E850',
  },
  scheduleCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleTimeActive: {
    color: '#164E2E',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 6,
  },
  scheduleTitleActive: {
    color: '#0E381B',
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 22,
    marginVertical: 10,
  },
  statusPillActive: {
    backgroundColor: '#164E2E',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusPillActiveText: {
    color: '#C8F572',
    fontWeight: '800',
    fontSize: 11,
  },
  scheduleTime: {
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 6,
  },
  scheduleTitle: {
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 22,
    marginVertical: 10,
  },
  statusPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusPillText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
  },

  // Water Efficiency Bar Card
  metricCard: {
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
  },
  metricCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  metricCardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  highBadge: {
    backgroundColor: '#C8F572',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  highBadgeText: {
    color: '#164E2E',
    fontWeight: '800',
    fontSize: 12,
  },
  barSegmentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  microBarSegment: {
    flex: 1,
    marginHorizontal: 1.5,
    borderRadius: 4,
  },
  barCaption: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },

  // Dual Cards Row
  dualCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  halfCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  halfCardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  normalPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  normalPillText: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '700',
  },
  soilPhValue: {
    fontSize: 16,
    fontWeight: '800',
    marginVertical: 6,
  },
  soilTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soilTrendText: {
    color: '#16A34A',
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 4,
  },
  radialGaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  semiCircleRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF7EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Agriculture Field Card
  fieldCardContainer: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  satelliteImageWrapper: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  satelliteImage: {
    width: '100%',
    height: '100%',
  },
  arTagPill: {
    position: 'absolute',
    backgroundColor: 'rgba(19, 35, 23, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  arTagHectares: {
    color: '#A3E635',
    fontSize: 10,
    fontWeight: '800',
  },
  arTagName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  satelliteBadge: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  satelliteBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 5,
  },
  fieldCardInfo: {
    padding: 16,
  },
  fieldInfoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  fieldName: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  harvestPill: {
    backgroundColor: '#EBF7EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  harvestPillText: {
    color: '#16A34A',
    fontWeight: '800',
    fontSize: 11,
  },
  fieldCoords: {
    fontSize: 12,
    marginBottom: 12,
  },
  fieldMetaRow: {
    flexDirection: 'row',
    gap: 18,
  },
  fieldMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldMetaText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },

  // Notification dot on bell
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    position: 'absolute',
    top: 8,
    right: 9,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
  },

  // Quick Actions single row
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  qaChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    backgroundColor: '#F1F4F1',
    borderColor: '#DDE5DE',
  },
  qaLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    color: '#3D5247',
  },
});
