import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
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
  
  const [selectedModule, setSelectedModule] = useState(null);

  const guides = [
    { 
      title: 'Organic Solutions', 
      ic: 'leaf', 
      col: COLORS.success, 
      desc: 'Compost and manure foundations',
      details: 'Using natural waste to build soil health over generations.',
      content: [
        { subtitle: 'Compost Teas', body: 'Brewing compost in water creates a liquid fertilizer rich in microbes. Apply every 2 weeks during peak growth.' },
        { subtitle: 'Manure Safety', body: 'Always aged manure for at least 6 months. Fresh manure contains high salts and pathogens that can burn plants.' },
        { subtitle: 'Cover Crops', body: 'Plant legumes like clover in the off-season to "fix" nitrogen in the soil naturally.' }
      ]
    },
    { 
      title: 'NPK Optimization', 
      ic: 'flask', 
      col: COLORS.info, 
      desc: 'Precision element balancing',
      details: 'Understanding the big three: Nitrogen, Phosphorus, and Potassium.',
      content: [
        { subtitle: 'Nitrogen (N) - Growth', body: 'Responsible for leaf and stem development. If leaves are yellowing, your soil likely needs a nitrogen boost.' },
        { subtitle: 'Phosphorus (P) - Roots', body: 'Crucial for early root development and blooming. Apply deep in the soil where roots can reach it.' },
        { subtitle: 'Potassium (K) - Health', body: 'Regulates water movement and strengthens the plant against diseases and drought.' }
      ]
    },
    { 
      title: 'Fertilizer Application', 
      ic: 'options', 
      col: COLORS.warning, 
      desc: 'Timing and technique guide',
      details: 'When and how you apply is as important as what you apply.',
      content: [
        { subtitle: 'Broadcasting', body: 'Evenly spreading dry fertilizer over the soil surface. Best for base preparation before planting.' },
        { subtitle: 'Side-Dressing', body: 'Applying fertilizer in a row next to growing plants. Focuses nutrients where they are needed most.' },
        { subtitle: 'Foliar Feeding', body: 'Spraying liquid nutrients directly onto leaves for instant absorption. Good for quick deficiency fixes.' }
      ]
    },
  ];

  const ReadingModule = ({ module, onClose }) => (
    <Modal visible={!!module} animationType="slide" presentationStyle="formSheet">
      <View style={[styles.modalContainer, { backgroundColor: COLORS.background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: COLORS.secondaryBackground }]}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: COLORS.textPrimary }]}>Module: {module?.title}</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.heroIconBox, { backgroundColor: `${module?.col}10` }]}>
            <Ionicons name={module?.ic} size={64} color={module?.col} />
          </View>
          
          <Text style={[styles.mainHeading, { color: COLORS.textPrimary }]}>{module?.details}</Text>
          
          {module?.content.map((item, i) => (
            <View key={i} style={[styles.articleBlock, { borderLeftColor: module?.col }]}>
              <Text style={[styles.articleSubtitle, { color: module?.col }]}>{item.subtitle}</Text>
              <Text style={[styles.articleBody, { color: COLORS.textSecondary }]}>{item.body}</Text>
            </View>
          ))}

          <View style={[styles.safetyWarning, { backgroundColor: `${COLORS.error}05` }]}>
            <Ionicons name="warning" size={20} color={COLORS.error} />
            <Text style={[styles.safetyText, { color: COLORS.textSecondary }]}>
              <Text style={{ fontWeight: '800', color: COLORS.error }}>Caution:</Text> Over-fertilization can cause "nutrient burn" and harm the environment. Always follow label directions.
            </Text>
          </View>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.primary }]} onPress={onClose}>
            <Text style={styles.actionBtnText}>Finish Reading</Text>
          </TouchableOpacity>
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <PageHeader title="Fertilizer Hub" />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={[styles.heroTitle, { color: COLORS.textPrimary }]}>Soil Nutrition</Text>
            <Text style={[styles.heroSub, { color: COLORS.textTertiary }]}>Scientifically backed guides for intelligent crop feeding</Text>
          </View>

          {guides.map((item, idx) => (
            <TouchableOpacity key={idx} style={[styles.card, { backgroundColor: COLORS.cardBackground }]} activeOpacity={0.9} onPress={() => setSelectedModule(item)}>
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
        <ReadingModule module={selectedModule} onClose={() => setSelectedModule(null)} />
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
  card: { flexDirection: 'row', padding: 20, borderRadius: 28, marginBottom: 16, gap: 20 },
  iconBox: { width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  textSide: { flex: 1, justifyContent: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  cardDesc: { fontSize: 14, lineHeight: 20, marginBottom: 10 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tipsBox: { padding: 24, borderRadius: 24, flexDirection: 'row', gap: 16, marginTop: 20 },
  tipsText: { flex: 1, fontSize: 14, lineHeight: 22 },

  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  closeBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  modalContent: { padding: 24 },
  heroIconBox: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 32 },
  mainHeading: { fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 40, lineHeight: 32 },
  articleBlock: { paddingLeft: 20, borderLeftWidth: 4, marginBottom: 32 },
  articleSubtitle: { fontSize: 13, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  articleBody: { fontSize: 16, lineHeight: 26, fontWeight: '500' },
  safetyWarning: { flexDirection: 'row', padding: 20, borderRadius: 24, gap: 16, marginBottom: 32 },
  safetyText: { flex: 1, fontSize: 14, lineHeight: 22 },
  actionBtn: { height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' }
});
