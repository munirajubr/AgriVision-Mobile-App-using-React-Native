import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import SafeScreen from '../../components/SafeScreen';
import PageHeader from '../../components/PageHeader';

const HelpSupportPage = () => {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    { question: 'How do I detect crop diseases?', answer: 'Navigate to the Disease Detection tab, take a clear photo of the affected plant leaf, and our AI will analyze it to identify the disease and provide treatment recommendations.' },
    { question: 'How accurate is the NPK soil analysis?', answer: 'Our NPK analysis uses advanced machine learning models trained on thousands of soil samples. While highly accurate, we recommend using it as a guide and consulting with agricultural experts for critical decisions.' },
    { question: 'How do I connect my IoT devices?', answer: 'Go to Profile > Connect Device, select your device type, and follow the on-screen instructions. Ensure your device is powered on and in pairing mode.' },
    { question: 'Where does the weather data come from?', answer: 'We aggregate weather data from multiple reliable sources including meteorological departments and satellite data to provide accurate forecasts for your farm location.' },
  ];

  const contactMethods = [
    { icon: 'mail-outline', title: 'Email', description: 'support@agrivision.com', action: () => Linking.openURL('mailto:support@agrivision.com'), color: COLORS.info },
    { icon: 'call-outline', title: 'Phone', description: '+1 (800) 123-4567', action: () => Linking.openURL('tel:+18001234567'), color: COLORS.success },
    { icon: 'logo-whatsapp', title: 'WhatsApp', description: 'Quick help', action: () => Linking.openURL('https://wa.me/18001234567'), color: '#25D366' },
  ];

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <PageHeader title="Help Center" />
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Visual */}
          <View style={styles.headerHero}>
            <View style={[styles.iconCircle, { backgroundColor: `${COLORS.primary}10` }]}>
              <Ionicons name="help-buoy" size={40} color={COLORS.primary} />
            </View>
            <Text style={[styles.heroTitle, { color: COLORS.textPrimary }]}>How can we help?</Text>
            <Text style={[styles.heroSub, { color: COLORS.textTertiary }]}>Find answers or reach out to our team</Text>
          </View>

          {/* Contact Grid */}
          <View style={styles.grid}>
            {contactMethods.map((item, i) => (
              <TouchableOpacity key={i} style={[styles.contactCard, { backgroundColor: COLORS.cardBackground }]} onPress={item.action}>
                <View style={[styles.miniCircle, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={[styles.cardTitle, { color: COLORS.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.cardDesc, { color: COLORS.textTertiary }]}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* FAQs */}
          <View style={styles.section}>
            <Text style={[styles.secTitle, { color: COLORS.textPrimary }]}>Frequently Asked Questions</Text>
            <View style={styles.faqList}>
              {faqs.map((faq, i) => (
                <TouchableOpacity key={i} style={[styles.faqBox, { backgroundColor: COLORS.cardBackground }]} onPress={() => setExpandedFAQ(expandedFAQ === i ? null : i)}>
                  <View style={styles.faqHeader}>
                    <Text style={[styles.faqQuest, { color: COLORS.textPrimary }]}>{faq.question}</Text>
                    <Ionicons name={expandedFAQ === i ? "chevron-up" : "chevron-down"} size={18} color={COLORS.textTertiary} />
                  </View>
                  {expandedFAQ === i && <Text style={[styles.faqAns, { color: COLORS.textSecondary }]}>{faq.answer}</Text>}
                </TouchableOpacity>
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
  grid: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  contactCard: { flex: 1, padding: 16, borderRadius: 24, alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 }, android: { elevation: 2 } }) },
  miniCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  cardDesc: { fontSize: 11, fontWeight: '500', textAlign: 'center' },
  section: { gap: 16 },
  secTitle: { fontSize: 19, fontWeight: '800', paddingLeft: 8 },
  faqList: { gap: 12 },
  faqBox: { padding: 20, borderRadius: 24 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  faqQuest: { fontSize: 15, fontWeight: '700', flex: 1 },
  faqAns: { fontSize: 14, lineHeight: 22, marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.03)', paddingTop: 12 }
});

export default HelpSupportPage;
