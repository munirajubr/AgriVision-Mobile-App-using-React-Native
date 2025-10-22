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

  console.log("Route params:", params);

  const diagnosisType = params.diagnosisType;
  const isDiseaseDiagnosis = diagnosisType === 'disease';
  const decodedIssues = JSON.parse(params.issues || '[]');
  const diseaseInput = params.diseaseInput ? JSON.parse(params.diseaseInput) : null;

  const diseaseName = diseaseInput?.diseaseName || (decodedIssues.length > 0 ? decodedIssues[0] : null);

  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDisplayText = (value) => {
    if (value === null || value === undefined || value === '') {
      return 'Details not available';
    }
    return String(value);
  };

  useEffect(() => {
    const fetchDiseaseInfo = async () => {
      if (!diseaseName) {
        setError('No disease name found in input or issues.');
        setDiseaseInfo(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setDiseaseInfo(null);

      try {
        const res = await fetch(`${FLASK_API_URL}/api/disease`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ disease_name: diseaseName }),
        });

        const data = await res.json();
        console.log("API response data:", data);

        if (res.ok && data.info && Object.keys(data.info).length > 0) {
          setDiseaseInfo(data.info);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError('No detailed info available.');
        }
      } catch {
        setError('Failed to fetch disease information.');
      } finally {
        setLoading(false);
      }
    };

    if (isDiseaseDiagnosis || diagnosisType === 'natural') {
      fetchDiseaseInfo();
    }
  }, [diseaseName, isDiseaseDiagnosis, diagnosisType]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disease Diagnosis</Text>
      </View>

      {/* Issues Detected */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Issues Detected</Text>
        {decodedIssues.length > 0 ? (
          decodedIssues.map((issue, idx) => (
            <View key={idx} style={styles.issueCard}>
              <Ionicons name="alert-circle" size={20} color="#F44336" />
              <Text style={styles.issueText}>{issue}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No issues detected.</Text>
        )}
      </View>

      {/* Days to Recovery and Impact on Yield - top summary */}
      {diseaseInfo && !loading && !error && (
        <View style={[styles.section, { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }]}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.twoColumnLabel}>
              {getDisplayText(diseaseInfo['Days to Recovery'])}
            </Text>
            <Text style={styles.twoColumnValue}>Days to Recovery</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.twoColumnLabel}>
              {getDisplayText(diseaseInfo['Impact on Yield'])}
            </Text>
            <Text style={styles.twoColumnValue}>Impact</Text>
          </View>
        </View>
      )}

      {/* Loading and Error */}
      {loading && (
        <View style={{ padding: 20 }}>
          <Text style={{ textAlign: 'center' }}>Loading disease details...</Text>
        </View>
      )}
      {!loading && error && (
        <Text style={{ color: 'red', textAlign: 'center', padding: 10 }}>{error}</Text>
      )}

      {/* Disease Info */}
      {!loading && !error && (
        diseaseInfo && Object.keys(diseaseInfo).length > 0 ? (
          <>

            {[  
              { label: 'Symptoms Description', key: 'Symptoms Description' },
              { label: 'Natural Resolution', key: 'Natural Resolution' },
              { label: 'Chemical Resolution', key: 'Chemical Resolution' },
              { label: 'Severity Level', key: 'Severity Level' },
            ].map(({ label, key }) => (
              <View key={key} style={styles.detailCard}>
                <Text style={styles.detailCardTitle}>{label}</Text>
                <Text style={styles.detailCardDescription}>
                  {getDisplayText(diseaseInfo[key])}
                </Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={[styles.emptyText, { padding: 20, textAlign: 'center' }]}>
            No detailed disease information available.
          </Text>
        )
      )}

      {/* Done Button */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.push('/(tabs)')}
        activeOpacity={0.8}
      >
        <Text style={styles.homeButtonText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DiagnosisPage;
