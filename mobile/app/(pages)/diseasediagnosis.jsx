import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import COLORS from '../../constants/colors';
import { FLASK_API_URL } from '../../constants/flaskapi';
import styles from '../../assets/styles/diseasediagnosis.styles';

const DiagnosisPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse inputs defensively
  const diagnosisType = params?.diagnosisType ? String(params.diagnosisType) : '';
  const isDiseaseDiagnosis = ['disease', 'model', 'natural'].includes(diagnosisType);

  const decodedIssues = useMemo(() => {
    try {
      return params?.issues ? JSON.parse(String(params.issues)) : [];
    } catch {
      return [];
    }
  }, [params?.issues]);

  const diseaseInput = useMemo(() => {
    try {
      return params?.diseaseInput ? JSON.parse(String(params.diseaseInput)) : null;
    } catch {
      return null;
    }
  }, [params?.diseaseInput]);

  const diseaseName =
    diseaseInput?.diseaseName || (decodedIssues.length > 0 ? decodedIssues[0] : null);

  // State for disease info fetch
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  const getDisplayText = (value) => {
    if (value === null || value === undefined || value === '') return 'Details not available';
    return String(value);
  };

  // Fetch disease details from Flask API
  useEffect(() => {
    const fetchDiseaseInfo = async () => {
      if (!isDiseaseDiagnosis) {
        setDiseaseInfo(null);
        setErrorInfo('Not a disease diagnosis flow.');
        return;
      }
      if (!diseaseName) {
        setDiseaseInfo(null);
        setErrorInfo('No disease name found in input or issues.');
        return;
      }

      setLoadingInfo(true);
      setErrorInfo(null);
      setDiseaseInfo(null);

      try {
        const res = await fetch(`${FLASK_API_URL}/api/disease`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ disease_name: diseaseName }),
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data?.info && Object.keys(data.info).length > 0) {
          setDiseaseInfo(data.info);
        } else if (data?.error) {
          setErrorInfo(data.error);
        } else {
          setErrorInfo('No detailed info available.');
        }
      } catch {
        setErrorInfo('Failed to fetch disease information.');
      } finally {
        setLoadingInfo(false);
      }
    };

    fetchDiseaseInfo();
  }, [isDiseaseDiagnosis, diseaseName]);

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
              <Text style={styles.issueText}>{String(issue)}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No issues detected.</Text>
        )}
      </View>

      {/* Loading and Error for disease info */}
      {loadingInfo && (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={{ marginTop: 8 }}>Loading disease details...</Text>
        </View>
      )}

      {!loadingInfo && errorInfo && (
        <Text style={{ color: 'red', textAlign: 'center', padding: 10 }}>{errorInfo}</Text>
      )}

      {/* Disease summary and details */}
      {!loadingInfo && !errorInfo && diseaseInfo && (
        <>
          {/* Top summary */}
          <View
            style={[
              styles.section,
              { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
            ]}
          >
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.twoColumnLabel}>
                {getDisplayText(diseaseInfo['Days to Recovery'])}
              </Text>
              <Text style={styles.twoColumnValue}>Days to Recovery</Text>
            </View>
            {/* <View style={{ alignItems: 'center' }}>
              <Text style={styles.twoColumnLabel}>
                {getDisplayText(diseaseInfo['Impact on Yield'])}
              </Text>
              <Text style={styles.twoColumnValue}>Impact</Text>
            </View> */}
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.twoColumnLabel}>
                {getDisplayText(diseaseInfo['Severity Level'])}
              </Text>
              <Text style={styles.twoColumnValue}>Severity Level</Text>
            </View>
          </View>

          {/* Detailed cards */}
          {[
            { label: 'Symptoms Description', key: 'Symptoms Description' },
            { label: 'Natural Resolution', key: 'Natural Resolution' },
            { label: 'Chemical Resolution', key: 'Chemical Resolution' },
            // { label: 'Severity Level', key: 'Severity Level' },
            { label: 'Impact on Yield', key: 'Impact on Yield' },
          ].map(({ label, key }) => (
            <View key={key} style={styles.detailCard}>
              <Text style={styles.detailCardTitle}>{label}</Text>
              <Text style={styles.detailCardDescription}>
                {getDisplayText(diseaseInfo[key])}
              </Text>
            </View>
          ))}
        </>
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
