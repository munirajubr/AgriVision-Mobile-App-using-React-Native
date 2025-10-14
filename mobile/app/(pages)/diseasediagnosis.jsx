import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import COLORS from '../../constants/colors';

const DiagnosisPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const diagnosisType = params.diagnosisType;
  const isNatural = diagnosisType === 'natural';
  
  // Parse issues from JSON string
  const issues = JSON.parse(params.issues || '[]');

  // Mock treatment data based on diagnosis type
  const treatments = isNatural ? [
    {
      id: 1,
      name: 'Neem Oil Spray',
      description: 'Natural fungicide and pesticide',
      application: 'Mix 2 tablespoons per liter of water. Spray in the evening.',
      frequency: 'Every 7 days',
      icon: 'leaf',
      color: '#4CAF50',
    },
    {
      id: 2,
      name: 'Compost Tea',
      description: 'Boost plant immunity naturally',
      application: 'Dilute 1:10 with water and apply to soil',
      frequency: 'Twice weekly',
      icon: 'water',
      color: '#2196F3',
    },
  ] : [
    {
      id: 1,
      name: 'Mancozeb Fungicide',
      description: 'Broad-spectrum fungicide for leaf diseases',
      application: 'Mix 2g per liter. Spray thoroughly on affected areas.',
      frequency: 'Every 10-14 days',
      icon: 'flask',
      color: '#2196F3',
    },
    {
      id: 2,
      name: 'NPK 19-19-19',
      description: 'Balanced fertilizer for nutrient deficiency',
      application: '5g per liter as foliar spray',
      frequency: 'Every 15 days',
      icon: 'beaker',
      color: '#FF9800',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isNatural ? 'Natural' : 'Chemical'} Diagnosis
        </Text>
      </View>

      {/* Plant Info Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Crop Type:</Text>
          <Text style={styles.summaryValue}>{params.crop}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Plant Part:</Text>
          <Text style={styles.summaryValue}>{params.part}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Health Status:</Text>
          <Text style={[styles.summaryValue, { color: '#FF9800' }]}>{params.health}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Confidence:</Text>
          <Text style={styles.summaryValue}>{params.confidence}%</Text>
        </View>
      </View>

      {/* Issues Detected */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Issues Detected</Text>
        {issues.map((issue, index) => (
          <View key={index} style={styles.issueCard}>
            <Ionicons name="alert-circle" size={20} color="#F44336" />
            <Text style={styles.issueText}>{issue}</Text>
          </View>
        ))}
      </View>

      {/* Recommended Treatments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Treatments</Text>
        {treatments.map((treatment) => (
          <View key={treatment.id} style={styles.treatmentCard}>
            <View style={[styles.treatmentIcon, { backgroundColor: `${treatment.color}15` }]}>
              <Ionicons name={treatment.icon} size={28} color={treatment.color} />
            </View>
            
            <View style={styles.treatmentContent}>
              <Text style={styles.treatmentName}>{treatment.name}</Text>
              <Text style={styles.treatmentDescription}>{treatment.description}</Text>
              
              <View style={styles.treatmentDetail}>
                <Ionicons name="information-circle-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.treatmentDetailText}>
                  <Text style={styles.treatmentDetailLabel}>Application: </Text>
                  {treatment.application}
                </Text>
              </View>
              
              <View style={styles.treatmentDetail}>
                <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.treatmentDetailText}>
                  <Text style={styles.treatmentDetailLabel}>Frequency: </Text>
                  {treatment.frequency}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Additional Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Tips</Text>
        <View style={styles.tipsCard}>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.tipText}>Monitor plant daily for changes</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.tipText}>Ensure proper drainage in soil</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.tipText}>Remove affected leaves if necessary</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  summaryCard: {
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  issueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4433610',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  issueText: {
    fontSize: 14,
    color: '#F44336',
    marginLeft: 8,
    flex: 1,
  },
  treatmentCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  treatmentIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  treatmentContent: {
    flex: 1,
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  treatmentDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  treatmentDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  treatmentDetailText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  treatmentDetailLabel: {
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  tipsCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
});

export default DiagnosisPage;
