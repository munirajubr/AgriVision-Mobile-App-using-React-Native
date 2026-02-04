import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import SafeScreen from '../../components/SafeScreen';
import PageHeader from '../../components/PageHeader';

export default function FertilizerGuide() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  const guides = [
    { title: 'Organic Solutions', ic: 'leaf-outline', col: COLORS.success, desc: 'Using compost and manure to enrich soil naturally over time.' },
    { title: 'NPK Optimization', ic: 'flask-outline', col: COLORS.info, desc: 'Understanding Nitrogen, Phosphorus, and Potassium ratios for growth.' },
    { title: 'Micronutrients', ic: 'sparkles-outline', col: COLORS.warning, desc: 'Small elements like Zinc and Iron that make a big difference in health.' },
  ];

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <PageHeader title="Fertilizer Hub" />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={[styles.heroTitle, { color: COLORS.textPrimary }]}>Soil Nutrition</Text>
            <Text style={[styles.heroSub, { color: COLORS.textTertiary }]}>Scientifically backed fertilizer management</Text>
          </View>

          {guides.map((item, idx) => (
            <TouchableOpacity key={idx} style={[styles.card, { backgroundColor: COLORS.cardBackground }]} activeOpacity={0.9}>
              <View style={[styles.iconBox, { backgroundColor: `${item.col}15` }]}>
                <Ionicons name={item.ic} size={28} color={item.col} />
              </View>
              <View style={styles.textSide}>
                <Text style={[styles.cardTitle, { color: COLORS.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.cardDesc, { color: COLORS.textSecondary }]}>{item.desc}</Text>
                <View style={styles.actionRow}>
                  <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 13 }}>Read Module</Text>
                  <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          <View style={[styles.tipsBox, { backgroundColor: `${COLORS.info}08` }]}>
            <Ionicons name="bulb" size={24} color={COLORS.info} />
            <Text style={[styles.tipsText, { color: COLORS.textSecondary }]}>
              <Text style={{ fontWeight: '800', color: COLORS.info }}>Pro Tip:</Text> Always test your soil before applying nitrogen-heavy fertilizers to prevent nutrient leaching.
            </Text>
          </View>

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
  heroSub: { fontSize: 16, fontWeight: '500' },
  card: { flexDirection: 'row', padding: 20, borderRadius: 28, marginBottom: 16, gap: 20, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10 }, android: { elevation: 1 } }) },
  iconBox: { width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  textSide: { flex: 1, justifyContent: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  cardDesc: { fontSize: 14, lineHeight: 20, marginBottom: 10 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tipsBox: { padding: 24, borderRadius: 24, flexDirection: 'row', gap: 16, marginTop: 20 },
  tipsText: { flex: 1, fontSize: 14, lineHeight: 22 }
});
