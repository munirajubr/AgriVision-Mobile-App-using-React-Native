import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import COLORS from '../../constants/colors';

const API_URL = 'http://localhost:5000'; // Update with your backend URL

const DiagnosisPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const diagnosisType = params.diagnosisType;
  const isNatural = diagnosisType === 'natural';

  // Parse issues from JSON string
  const issues = JSON.parse(params.issues || '[]');

  // Disease name based on first detected issue or fallback
  const diseaseName = issues.length > 0 ? issues[0] : '';

  const [remedies, setRemedies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch remedies for the detected disease from the Flask API
  useEffect(() => {
    if (!diseaseName) {
      setRemedies([]);
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/api/remedy/${encodeURIComponent(diseaseName)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.disease_info && data.disease_info.remedies) {
          // Split remedies string into bullet list if it's a string of sentences separated by semicolons or new lines
          const remediesArr = data.disease_info.remedies.split(/;|\n/).map((r) => r.trim()).filter((r) => r.length > 0);
          setRemedies(remediesArr);
        } else {
          setRemedies(['No remedies information available']);
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to fetch remedies. Please try again later.');
        setRemedies([]);
      })
      .finally(() => setLoading(false));
  }, [diseaseName]);

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
        {issues.length > 0 ? (
          issues.map((issue, index) => (
            <View key={index} style={styles.issueCard}>
              <Ionicons name="alert-circle" size={20} color="#F44336" />
              <Text style={styles.issueText}>{issue}</Text>
            </View>
          ))
        ) : (
          <Text>No issues detected</Text>
        )}
      </View>

      {/* Recommended Treatments (From Fetch) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Treatments</Text>
        {loading ? (
          <Text>Loading remedies...</Text>
        ) : (
          remedies.length > 0 ? (
            remedies.map((rec, index) => (
              <Text key={index} style={styles.treatmentText}>• {rec}</Text>
            ))
          ) : (
            <Text>No remedies available.</Text>
          )
        )}
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
  // Keep your existing styles here, or you can reuse the original styles
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
  treatmentText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
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
