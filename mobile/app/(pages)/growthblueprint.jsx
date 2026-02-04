import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import SafeScreen from '../../components/SafeScreen';
import PageHeader from '../../components/PageHeader';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CROP_BLUEPRINTS = {
  'Rice': {
    color: '#007AFF', // Blue for water intensive
    icon: 'water',
    description: 'Optimal for your high-humidity and heavy rainfall data.',
    phases: [
      { title: 'Soil Preparation', details: 'Deep plow and puddle the soil to create an impermeable layer. Maintain pH between 5.5 - 6.5.', icon: 'earth' },
      { title: 'Planting Tech', details: 'Transplant 25-day old seedlings. Maintain 20x15 cm spacing for maximum airflow.', icon: 'leaf' },
      { title: 'Water Management', details: 'Keep 5cm of standing water. Drain only 10 days before harvest for grain hardening.', icon: 'umbrella' },
      { title: 'Nutrient Split', details: 'Apply Nitrogen in 3 splits. Full Phosphorous as base. Potash in early tillering.', icon: 'flask' }
    ]
  },
  'Tomato': {
    color: '#FF3B30', // Red
    icon: 'nutrition',
    description: 'Your soil pH is perfectly tuned for high-growth tomato harvesting.',
    phases: [
      { title: 'Foundation', details: 'Mix rich compost into the top 6 inches. Tomato roots need loose, aerated soil.', icon: 'color-filter' },
      { title: 'Support Structure', details: 'Install stakes or cages immediately. Prevents soil-borne diseases on fruit.', icon: 'construct' },
      { title: 'Irrigation', details: 'Drip irrigation is mandatory. Wetting leaves leads to early blight and fungus.', icon: 'water' },
      { title: 'Fruition Boost', details: 'Switch to high-potassium fertilizer once first flowers appear to boost size.', icon: 'sparkles' }
    ]
  },
  'Maize': {
    color: '#FFCC00', // Yellow
    icon: 'sunny',
    description: 'High nitrogen profile in your soil is ideal for heavy-consuming maize crops.',
    phases: [
      { title: 'Early Sowing', details: 'Sow at 2-3 inch depth. Soil temperature must be consistently above 15°C.', icon: 'sunny' },
      { title: 'Block Planting', details: 'Plant in blocks of 4 rows rather than 1 long row to ensure high pollination rates.', icon: 'grid' },
      { title: 'Nitrogen Feeding', details: 'Apply side-dressing when plants reach knee-high. This is the peak growth window.', icon: 'flash' },
      { title: 'Harvest Timing', details: 'Wait for husks to dry and silks to turn brown. Grain moisture should be <20%.', icon: 'trending-up' }
    ]
  },
  'Potato': {
    color: '#D2B48C', // Tan
    icon: 'grid',
    description: 'Matches your current cool climate data and well-draining soil profile.',
    phases: [
      { title: 'Tuber Prep', details: 'Use certified seed potatoes. Sprout them in specialized trays before planting.', icon: 'sunny' },
      { title: 'Hilling Process', details: 'Mound soil around the plant every 2 weeks. Prevents potatoes from turning green.', icon: 'earth' },
      { title: 'Disease Watch', details: 'Scout daily for late blight. High humidity in your area increases risk.', icon: 'eye' },
      { title: 'Curing', details: 'Leave in dry soil for 1 week after vine death to thicken the skin for storage.', icon: 'shield-checkmark' }
    ]
  }
};

export default function GrowthBlueprint() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  
  const cropName = params.cropName || 'Generic Crop';
  const blueprint = CROP_BLUEPRINTS[cropName] || {
    color: COLORS.primary,
    icon: 'leaf',
    description: 'Analyzed soil profile indicates a strong match for this crop variety.',
    phases: [
      { title: 'Soil Prep', details: 'Ensure proper drainage and mix in organic matter.', icon: 'earth' },
      { title: 'Planting', details: 'Observe local seasonal windows for sowing.', icon: 'leaf' },
      { title: 'Watering', details: 'Maintain consistent moisture levels avoid waterlogging.', icon: 'water' },
      { title: 'Fertilizer', details: 'Balance nutrients based on growth stages.', icon: 'flask' }
    ]
  };

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <PageHeader title="Growth Blueprint" />
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Stunning Header Card */}
          <LinearGradient
            colors={[blueprint.color, `${blueprint.color}CC`]}
            style={styles.heroCard}
          >
            <View style={styles.heroOverlay}>
              <View style={styles.iconCircle}>
                <Ionicons name={blueprint.icon} size={42} color={blueprint.color} />
              </View>
              <Text style={styles.heroTitle}>{cropName} Strategy</Text>
              <Text style={styles.heroDesc}>{blueprint.description}</Text>
            </View>
            <View style={styles.compatibilityBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#FFF" />
              <Text style={styles.badgeText}>CLIMATE OPTIMIZED</Text>
            </View>
          </LinearGradient>

          {/* Roadmap Title */}
          <View style={styles.roadmapHeader}>
            <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Action Roadmap</Text>
            <View style={[styles.stepCount, { backgroundColor: `${COLORS.primary}15` }]}>
              <Text style={[styles.stepCountText, { color: COLORS.primary }]}>4 PHASES</Text>
            </View>
          </View>

          {/* Timeline View */}
          <View style={styles.timeline}>
            {blueprint.phases.map((phase, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.leftCol}>
                  <View style={[styles.dot, { backgroundColor: blueprint.color }]}>
                    <Ionicons name={phase.icon} size={14} color="#FFF" />
                  </View>
                  {index < blueprint.phases.length - 1 && <View style={[styles.line, { backgroundColor: `${blueprint.color}30` }]} />}
                </View>
                <View style={[styles.contentCard, { backgroundColor: COLORS.cardBackground, borderColor: COLORS.border }]}>
                  <Text style={[styles.phaseTitle, { color: COLORS.textPrimary }]}>{phase.title}</Text>
                  <Text style={[styles.phaseDetails, { color: COLORS.textSecondary }]}>{phase.details}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Success Tips */}
          <View style={[styles.infoBanner, { backgroundColor: `${COLORS.primary}05`, borderColor: `${COLORS.primary}20` }]}>
            <View style={[styles.infoIcon, { backgroundColor: COLORS.primary }]}>
              <Ionicons name="bulb" size={20} color="#FFF" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoHeading, { color: COLORS.textPrimary }]}>Precision Tip</Text>
              <Text style={[styles.infoDesc, { color: COLORS.textSecondary }]}>
                Your local nitrogen levels are high. Reduce base N-application by 15% to avoid leafy overgrowth and ensure strong fruit setting.
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.doneBtn, { backgroundColor: COLORS.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.doneBtnText}>Confirm Strategy</Text>
            <Ionicons name="shield-checkmark" size={20} color="#FFF" />
          </TouchableOpacity>

          <View style={{ height: 50 }} />
        </ScrollView>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  
  heroCard: { 
    height: 220, 
    borderRadius: 36, 
    padding: 24, 
    justifyContent: 'center', 
    marginBottom: 32,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 20 },
      android: { elevation: 8 }
    })
  },
  heroOverlay: { alignItems: 'center' },
  iconCircle: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: 'rgba(255,255,255,0.95)', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  heroTitle: { color: '#FFF', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  heroDesc: { color: '#FFF', fontSize: 13, textAlign: 'center', opacity: 0.9, marginTop: 6, fontWeight: '500', paddingHorizontal: 20 },
  compatibilityBadge: { 
    position: 'absolute', 
    top: 20, 
    right: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '900' },

  roadmapHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  stepCount: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  stepCountText: { fontSize: 11, fontWeight: '900' },

  timeline: { paddingLeft: 10 },
  timelineItem: { flexDirection: 'row', marginBottom: 24 },
  leftCol: { alignItems: 'center', marginRight: 16 },
  dot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  line: { width: 2, flex: 1, marginVertical: -4 },
  
  contentCard: { flex: 1, padding: 20, borderRadius: 24, borderWidth: 1 },
  phaseTitle: { fontSize: 17, fontWeight: '800', marginBottom: 8 },
  phaseDetails: { fontSize: 14, lineHeight: 22, fontWeight: '500' },

  infoBanner: { flexDirection: 'row', padding: 24, borderRadius: 28, borderWidth: 1, gap: 16, marginTop: 10, marginBottom: 32 },
  infoIcon: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  infoTextContainer: { flex: 1 },
  infoHeading: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  infoDesc: { fontSize: 14, lineHeight: 22, fontWeight: '500' },

  doneBtn: { height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  doneBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' }
});
