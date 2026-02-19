import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import SafeScreen from '../../components/SafeScreen';
import PageHeader from '../../components/PageHeader';

const TermsPage = () => {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  const sections = [
    { title: "1. Acceptance of Terms", content: "By accessing and using AgriVision, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the application." },
    { title: "2. Use of AI Services", content: "Our AI-powered disease detection and soil analysis are designed for informational purposes. While we strive for high accuracy, results should be verified with agricultural professionals." },
    { title: "3. User Data & Privacy", content: "We collect data to improve your farming experience. Your personal information and farm data are handled in accordance with our Privacy Policy. We do not sell your data to third parties." },
    { title: "4. IoT Device Integration", content: "AgriVision connects to hardware sensors. Users are responsible for maintaining their hardware and ensuring secure network connections for device data transmission." }
  ];

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <PageHeader title="Terms of Service" />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.heroBox}>
            <Text style={[styles.heroDate, { color: COLORS.primary }]}>EFFECTIVE JAN 2024</Text>
            <Text style={[styles.heroTitle, { color: COLORS.textPrimary }]}>Legal Agreement</Text>
            <Text style={[styles.heroSub, { color: COLORS.textTertiary }]}>Please read our terms carefully before using the AgriVision ecosystem.</Text>
          </View>

          {sections.map((sec, i) => (
            <View key={i} style={[styles.card, { backgroundColor: COLORS.cardBackground }]}>
              <Text style={[styles.cardTitle, { color: COLORS.textPrimary }]}>{sec.title}</Text>
              <Text style={[styles.cardContent, { color: COLORS.textSecondary }]}>{sec.content}</Text>
            </View>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  heroBox: { paddingVertical: 20, marginBottom: 10 },
  heroDate: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  heroTitle: { fontSize: 32, fontWeight: '800', marginBottom: 12 },
  heroSub: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
  card: { padding: 24, borderRadius: 28, marginBottom: 16, borderWidth: 1, borderColor: '#F0F0F0' },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  cardContent: { fontSize: 15, lineHeight: 24, fontWeight: '400' }
});

export default TermsPage;
