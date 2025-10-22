import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import COLORS from '../../constants/colors';
import { FLASK_API_URL } from '../../constants/flaskapi';
import styles from '../../assets/styles/diseasediagnosis.styles';

const DiagnosisPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const diagnosisType = params.diagnosisType;
  const isDiseaseDiagnosis = diagnosisType === 'disease';

  const diseaseInput = params.diseaseInput ? JSON.parse(params.diseaseInput) : null;
  const issues = JSON.parse(params.issues || '[]');

  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDiseaseDiagnosis && diseaseInput) {
      setLoading(true);

      fetch(`${FLASK_API_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diseaseInput),
      })
        .then(response => response.json())
        .then(data => {
          if (data.info) {
            setDiseaseInfo(data.info);
          } else {
            setDiseaseInfo({});
            Alert.alert('No detailed info available.');
          }
        })
        .catch(() => {
          Alert.alert('Error', 'Failed to fetch disease information.');
          setDiseaseInfo({});
        })
        .finally(() => setLoading(false));
    }
  }, [diseaseInput, isDiseaseDiagnosis]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disease Diagnosis</Text>
      </View>

      {/* Issues Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Issues Detected</Text>
        {issues.length > 0 ? (
          issues.map((issue, idx) => (
            <View key={idx} style={styles.issueCard}>
              <Ionicons name="alert-circle" size={20} color="#F44336" />
              <Text style={styles.issueText}>{issue}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No issues detected.</Text>
        )}
      </View>

      {/* Two column summary like Days to Recovery and Severity Level */}
      <View style={styles.twoColumnContainer}>
        <View style={styles.twoColumnItem}>
          <Text style={styles.twoColumnLabel}>Days to Recovery</Text>
          <Text style={styles.twoColumnValue}>
            {diseaseInfo?.['Days to Recovery'] ?? '-'}
          </Text>
        </View>
        <View style={styles.twoColumnItem}>
          <Text style={styles.twoColumnLabel}>Severity Level</Text>
          <Text style={styles.twoColumnValue}>
            {diseaseInfo?.['Severity Level'] ?? '-'}
          </Text>
        </View>
      </View>

      {/* Cards for other detailed sections */}
      {[
        { label: 'Symptoms Description', key: 'Symptoms Description' },
        { label: 'Impact on Yield', key: 'Impact on Yield' },
        { label: 'Natural Resolution', key: 'Natural Resolution' },
        { label: 'Chemical Resolution', key: 'Chemical Resolution' },
      ].map(({ label, key }) => (
        <View key={label} style={styles.detailCard}>
          <Text style={styles.detailCardTitle}>{label}</Text>
          <Text style={styles.detailCardDescription}>
            {diseaseInfo?.[key] ?? `${label} details here`}
          </Text>
        </View>
      ))}
      {/* Back to Home Button */}
              <TouchableOpacity
                style={styles.homeButton}
                onPress={() => router.push("/(tabs)")}
                activeOpacity={0.8}
              >
                <Ionicons name="home" size={20} color="#fff" />
                <Text style={styles.homeButtonText}>Done</Text>
              </TouchableOpacity>
    </ScrollView>
  );
};
 
export default DiagnosisPage;
