import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Modal, Animated } from 'react-native';
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
  
  const [selectedCrop, setSelectedCrop] = useState(null);

  const crops = [
    { 
      name: 'Rice', 
      ic: 'water',
      col: COLORS.info, 
      desc: 'High temperature & heavy rainfall', 
      details: 'Thrives in flooded soils. Humidity above 70% is ideal.',
      fullGuide: {
        soil: 'Heavy clay or loamy soil that can hold water is best. Optimal pH is 5.5 to 6.5.',
        spacing: 'Transplant seedlings with 20cm x 15cm spacing for optimal sunlight penetration.',
        water: 'Keep 5-10cm of standing water during the vegetative stage. Drain before harvest.',
        fertilizer: 'Requires high Nitrogen (N) in split doses: base, tillering, and panicle initiation.'
      }
    },
    { 
      name: 'Tomato', 
      ic: 'nutrition',
      col: COLORS.error, 
      desc: 'Sunlight & stable nitrogen', 
      details: 'Requires 6-8 hours of sunlight. Water at the base.',
      fullGuide: {
        soil: 'Rich, well-draining soil with organic matter. Ideal pH is 6.0 to 6.8.',
        spacing: 'Space plants 18-24 inches apart in rows 3 feet apart to allow air circulation.',
        water: 'Consistent moisture is key. Uneven watering leads to blossom end rot.',
        fertilizer: 'Apply balanced fertilizer at planting, then high Phosphorus for fruit set.'
      }
    },
    { 
      name: 'Potato', 
      ic: 'grid',
      col: '#D2B48C', 
      desc: 'Cool climates & loose soil', 
      details: 'Plant in early spring. Needs well-drained acidic soil.',
      fullGuide: {
        soil: 'Loose, friable soil to allow tuber expansion. Deeply plowed with plenty of organic matter.',
        spacing: 'Plant seed pieces 10-12 inches apart in trenches 3 feet apart.',
        water: 'Regular watering, especially during flowering when tubers are forming.',
        fertilizer: 'High Phosphorus and Potassium (K) are essential for healthy tuber development.'
      }
    },
    { 
      name: 'Maize', 
      ic: 'sunny',
      col: COLORS.warning, 
      desc: 'Warm weather & drainage', 
      details: 'Space plants 12 inches apart. High nitrogen needs.',
      fullGuide: {
        soil: 'Loamy soil with good drainage. Warm soil (above 15°C) is necessary for germination.',
        spacing: 'Rows 30 inches apart with plants every 8-12 inches. Plant in blocks for pollination.',
        water: 'Critical during silking stage. Deep watering once a week is preferred.',
        fertilizer: 'Heaviest consumer of Nitrogen. Side-dress when plants are knee-high.'
      }
    }
  ];

  const ReadingModule = ({ crop, onClose }) => (
    <Modal visible={!!crop} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.modalContainer, { backgroundColor: COLORS.background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: COLORS.secondaryBackground }]}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: COLORS.textPrimary }]}>{crop?.name} Guide</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.heroBadge, { backgroundColor: `${crop?.col}15` }]}>
            <Ionicons name={crop?.ic} size={48} color={crop?.col} />
            <Text style={[styles.heroBadgeText, { color: crop?.col }]}>{crop?.name}</Text>
          </View>

          <Text style={[styles.guideIntro, { color: COLORS.textSecondary }]}>{crop?.details}</Text>

          {[
            { title: 'Soil Requirements', icon: 'earth', content: crop?.fullGuide.soil },
            { title: 'Plant Spacing', icon: 'move', content: crop?.fullGuide.spacing },
            { title: 'Watering Schedule', icon: 'water', content: crop?.fullGuide.water },
            { title: 'Fertilization', icon: 'flask', content: crop?.fullGuide.fertilizer },
          ].map((section, i) => (
            <View key={i} style={[styles.guideSection, { backgroundColor: COLORS.cardBackground }]}>
              <View style={styles.sectionHead}>
                <Ionicons name={section.icon} size={20} color={COLORS.primary} />
                <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>{section.title}</Text>
              </View>
              <Text style={[styles.sectionBody, { color: COLORS.textSecondary }]}>{section.content}</Text>
            </View>
          ))}

          <TouchableOpacity style={[styles.gotItBtn, { backgroundColor: COLORS.primary }]} onPress={onClose}>
            <Text style={styles.gotItText}>I've read the module</Text>
          </TouchableOpacity>
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <PageHeader title="Crop Library" />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={[styles.heroTitle, { color: COLORS.textPrimary }]}>Expert Guides</Text>
            <Text style={[styles.heroSub, { color: COLORS.textTertiary }]}>Professional blueprints for localized farming success</Text>
          </View>

          {crops.map((crop, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[styles.card, { backgroundColor: COLORS.cardBackground }]} 
              activeOpacity={0.8}
              onPress={() => setSelectedCrop(crop)}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: `${crop.col}15` }]}>
                  <Ionicons name={crop.ic} size={24} color={crop.col} />
                </View>
                <View style={styles.headerText}>
                  <Text style={[styles.cropName, { color: COLORS.textPrimary }]}>{crop.name}</Text>
                  <Text style={[styles.cropSub, { color: crop.col }]}>{crop.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
              </View>
              <View style={styles.footerRow}>
                <Ionicons name="book-outline" size={16} color={COLORS.primary} />
                <Text style={[styles.readTime, { color: COLORS.textTertiary }]}>4 min read • Intermediate</Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
        <ReadingModule crop={selectedCrop} onClose={() => setSelectedCrop(null)} />
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
  card: { padding: 24, borderRadius: 32, marginBottom: 16, borderLeftWidth: 6, borderLeftColor: 'transparent' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 56, height: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  cropName: { fontSize: 20, fontWeight: '800' },
  cropSub: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  divider: { height: 1, marginVertical: 20, opacity: 0.5 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  readTime: { fontSize: 13, fontWeight: '600' },
  
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  closeBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  modalContent: { padding: 24 },
  heroBadge: { padding: 32, borderRadius: 32, alignItems: 'center', marginBottom: 24 },
  heroBadgeText: { fontSize: 24, fontWeight: '900', marginTop: 12 },
  guideIntro: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 32, fontWeight: '500' },
  guideSection: { padding: 20, borderRadius: 24, marginBottom: 16 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  sectionBody: { fontSize: 15, lineHeight: 24 },
  gotItBtn: { height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  gotItText: { color: '#FFF', fontSize: 17, fontWeight: '800' }
});
