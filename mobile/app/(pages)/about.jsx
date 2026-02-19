import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import SafeScreen from '../../components/SafeScreen';
import PageHeader from '../../components/PageHeader';

const AboutPage = () => {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  const stats = [
    { label: 'Active Farmers', val: '50K+' },
    { label: 'Crops Supported', val: '24+' },
    { label: 'AI Accuracy', val: '98%' },
  ];

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <PageHeader title="About AgriVision" />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={[styles.logoBox, { backgroundColor: COLORS.primary }]}>
              <Ionicons name="leaf" size={50} color="#FFF" />
            </View>
            <Text style={[styles.appName, { color: COLORS.textPrimary }]}>AgriVision</Text>
            <Text style={[styles.appSub, { color: COLORS.textTertiary }]}>Digital Intelligence for Sustainable Farming</Text>
          </View>

          <View style={styles.statsRow}>
            {stats.map((s, i) => (
              <View key={i} style={[styles.statBox, { backgroundColor: COLORS.cardBackground }]}>
                <Text style={[styles.statVal, { color: COLORS.primary }]}>{s.val}</Text>
                <Text style={[styles.statLab, { color: COLORS.textTertiary }]}>{s.label}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.infoCard, { backgroundColor: COLORS.cardBackground }]}>
            <Text style={[styles.infoTitle, { color: COLORS.textPrimary }]}>Our Vision</Text>
            <Text style={[styles.infoText, { color: COLORS.textSecondary }]}>
              AgriVision was built with a single goal: to empower the cornerstone of human civilization—the farmers. 
              By merging cutting-edge AI Vision with real-time IoT soil data, we provide a 360-degree view of crop health.
            </Text>
          </View>

          <View style={[styles.infoCard, { backgroundColor: COLORS.cardBackground }]}>
            <Text style={[styles.infoTitle, { color: COLORS.textPrimary }]}>The Ecosystem</Text>
            <View style={styles.featRow}><Ionicons name="sparkles" size={18} color={COLORS.primary} /><Text style={[styles.featText, { color: COLORS.textSecondary }]}>Deep Learning Disease Diagnosis</Text></View>
            <View style={styles.featRow}><Ionicons name="hardware-chip" size={18} color={COLORS.primary} /><Text style={[styles.featText, { color: COLORS.textSecondary }]}>Real-time IoT Sensor Monitoring</Text></View>
            <View style={styles.featRow}><Ionicons name="analytics" size={18} color={COLORS.primary} /><Text style={[styles.featText, { color: COLORS.textSecondary }]}>Precise NPK & Fertilizer Advisory</Text></View>
          </View>

          <View style={styles.socialRow}>
            {['logo-github', 'logo-twitter', 'logo-linkedin'].map((name, i) => (
              <TouchableOpacity key={i} style={[styles.socialBtn, { backgroundColor: COLORS.cardBackground }]}>
                 <Ionicons name={name} size={22} color={COLORS.textPrimary} />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.copy, { color: COLORS.textTertiary }]}>© 2024 AgriVision IoT. Built with ❤️ for farmers.</Text>
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  hero: { alignItems: 'center', marginVertical: 30 },
  logoBox: { width: 100, height: 100, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  appName: { fontSize: 32, fontWeight: '800', marginBottom: 6 },
  appSub: { fontSize: 15, fontWeight: '500', textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statBox: { flex: 1, padding: 20, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0' },
  statVal: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  statLab: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  infoCard: { padding: 24, borderRadius: 28, marginBottom: 16, borderWidth: 1, borderColor: '#F0F0F0' },
  infoTitle: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  infoText: { fontSize: 15, lineHeight: 24, fontWeight: '400' },
  featRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 },
  featText: { fontSize: 15, fontWeight: '600' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 20 },
  socialBtn: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  copy: { textAlign: 'center', marginTop: 30, fontSize: 12, fontWeight: '500' }
});

export default AboutPage;
