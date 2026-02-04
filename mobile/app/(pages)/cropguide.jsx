import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import SafeScreen from '../../components/SafeScreen';
import PageHeader from '../../components/PageHeader';

export default function CropGuide() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  const crops = [
    { name: 'Potato', col: COLORS.success, desc: 'Cool climates & loose soil', details: 'Plant in early spring. Needs well-drained acidic soil (pH 5.0 to 6.0).' },
    { name: 'Tomato', col: COLORS.error, desc: 'Sunlight & stable nitrogen', details: 'Requires 6-8 hours of sunlight. Water at the base, not on leaves.' },
    { name: 'Corn', col: COLORS.warning, desc: 'Warm weather & drainage', details: 'Space plants 12 inches apart. High nitrogen needs during growth.' },
    { name: 'Rice', col: COLORS.info, desc: 'High temp & heavy rainfall', details: 'Thrives in flooded soils. Humidity above 70% is ideal for pollination.' },
  ];

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <PageHeader title="Crop Library" />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={[styles.heroTitle, { color: COLORS.textPrimary }]}>Growth Guides</Text>
            <Text style={[styles.heroSub, { color: COLORS.textTertiary }]}>Expert blueprints for maximum harvest yields</Text>
          </View>

          {crops.map((crop, idx) => (
            <TouchableOpacity key={idx} style={[styles.card, { backgroundColor: COLORS.cardBackground }]} activeOpacity={0.9}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: `${crop.col}15` }]}>
                  <Ionicons name="leaf" size={24} color={crop.col} />
                </View>
                <View style={styles.headerText}>
                  <Text style={[styles.cropName, { color: COLORS.textPrimary }]}>{crop.name}</Text>
                  <Text style={[styles.cropSub, { color: crop.col }]}>{crop.desc}</Text>
                </View>
              </View>
              <View style={[styles.divider, { backgroundColor: COLORS.secondaryBackground }]} />
              <Text style={[styles.details, { color: COLORS.textSecondary }]}>{crop.details}</Text>
              <TouchableOpacity style={styles.readMore}>
                <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Full Guide</Text>
                <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  hero: { marginBottom: 32, paddingLeft: 4 },
  heroTitle: { fontSize: 32, fontWeight: '800', marginBottom: 8 },
  heroSub: { fontSize: 16, fontWeight: '500', lineHeight: 24 },
  card: { padding: 24, borderRadius: 32, marginBottom: 20, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 20 }, android: { elevation: 2 } }) },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 56, height: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  cropName: { fontSize: 20, fontWeight: '800' },
  cropSub: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  divider: { height: 1, marginVertical: 20 },
  details: { fontSize: 15, lineHeight: 22 },
  readMore: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 }
});
