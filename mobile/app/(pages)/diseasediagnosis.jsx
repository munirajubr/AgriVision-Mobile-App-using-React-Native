import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../constants/colors';
import { FLASK_API_URL } from '../../constants/flaskapi';
import styles from '../../assets/styles/diseasediagnosis.styles';

/**
 * DiagnosisPage
 *
 * Accepts a few ways to receive the input record / disease name:
 *  - params.record (JSON string or object)         <-- highest priority
 *  - params.tempKey (key pointing to AsyncStorage) <-- good for large payloads (images/base64)
 *  - params.prediction (string | json)             <-- predicted disease name(s)
 *  - params.issues (json array string)             <-- array of issue names
 *  - params.diseaseInput (json string object)
 *
 * Behavior:
 *  - decide diseaseName from the above precedence
 *  - fetch disease info from Flask API: POST { disease_name }
 *  - show loading / error states
 */

const DiagnosisPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // params that may be provided
  const deviceId = params?.deviceId ?? null;
  const tempKey = params?.tempKey ?? null;

  // Raw params that may include record/prediction/issues
  const rawRecordParam = params?.record ?? null;
  const rawPredictionParam = params?.prediction ?? null;
  const rawIssuesParam = params?.issues ?? null;
  const rawDiseaseInputParam = params?.diseaseInput ?? null;
  const diagnosisType = params?.diagnosisType ? String(params.diagnosisType) : '';
  const isDiseaseDiagnosis = ['disease', 'model', 'natural'].includes(diagnosisType) || true; // allow default disease flow

  const [recordFromStorage, setRecordFromStorage] = useState(null);
  const [loadingRecord, setLoadingRecord] = useState(Boolean(tempKey));
  const [recordLoadError, setRecordLoadError] = useState(null);

  // load record from tempKey if provided
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!tempKey) {
        setLoadingRecord(false);
        return;
      }
      try {
        setLoadingRecord(true);
        const raw = await AsyncStorage.getItem(tempKey);
        if (!mounted) return;
        if (!raw) {
          setRecordFromStorage(null);
          setRecordLoadError('No record found in storage.');
        } else {
          try {
            const parsed = JSON.parse(raw);
            setRecordFromStorage(parsed);
            // optional: remove the tempKey to avoid lingering data
            await AsyncStorage.removeItem(tempKey);
          } catch (e) {
            // raw is string (maybe plain text)
            setRecordFromStorage(raw);
          }
        }
      } catch (e) {
        console.warn('Failed to load record from AsyncStorage', e);
        setRecordFromStorage(null);
        setRecordLoadError('Failed to load stored record.');
      } finally {
        setLoadingRecord(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [tempKey]);

  // Parse record param (if provided). Support object or JSON string.
  const parsedRecordParam = useMemo(() => {
    if (!rawRecordParam) return null;
    if (typeof rawRecordParam === 'object') return rawRecordParam;
    try {
      return JSON.parse(String(rawRecordParam));
    } catch {
      return String(rawRecordParam);
    }
  }, [rawRecordParam]);

  // Parsed prediction fallback
  const parsedPrediction = useMemo(() => {
    if (rawPredictionParam === undefined || rawPredictionParam === null) return null;
    if (typeof rawPredictionParam === 'object') return rawPredictionParam;
    try {
      return JSON.parse(String(rawPredictionParam));
    } catch {
      return String(rawPredictionParam);
    }
  }, [rawPredictionParam]);

  // parsed issues (array) fallback
  const parsedIssues = useMemo(() => {
    if (!rawIssuesParam) return [];
    if (Array.isArray(rawIssuesParam)) return rawIssuesParam;
    try {
      const v = JSON.parse(String(rawIssuesParam));
      return Array.isArray(v) ? v : [];
    } catch {
      return [String(rawIssuesParam)];
    }
  }, [rawIssuesParam]);

  // diseaseInput param (object)
  const diseaseInput = useMemo(() => {
    if (!rawDiseaseInputParam) return null;
    if (typeof rawDiseaseInputParam === 'object') return rawDiseaseInputParam;
    try {
      return JSON.parse(String(rawDiseaseInputParam));
    } catch {
      return null;
    }
  }, [rawDiseaseInputParam]);

  // Determine the "record" to use (priority): parsedRecordParam -> recordFromStorage -> null
  const activeRecord = parsedRecordParam ?? recordFromStorage ?? null;

  // Determine diseaseName with precedence:
  // 1. diseaseInput.diseaseName
  // 2. activeRecord.prediction || activeRecord.predicted_class || activeRecord.model_prediction (various shapes)
  // 3. parsedPrediction
  // 4. parsedIssues[0]
  // 5. null
  const diseaseName = useMemo(() => {
    // 1
    if (diseaseInput && diseaseInput.diseaseName) return String(diseaseInput.diseaseName);

    // 2 - try to extract from activeRecord (multiple common keys)
    if (activeRecord && typeof activeRecord === 'object') {
      const p =
        activeRecord.prediction ??
        activeRecord.model_prediction ??
        activeRecord.model_prediction_raw ??
        activeRecord.predicted_label ??
        activeRecord.predicted_class ??
        activeRecord.class ??
        null;
      if (p) {
        if (Array.isArray(p)) return String(p[0]);
        if (typeof p === 'object') {
          return String(p.class ?? p.label ?? JSON.stringify(p));
        }
        return String(p);
      }
      // sometimes the record itself is just a string disease name
      if (typeof activeRecord === 'string') return activeRecord;
    }

    // 3
    if (parsedPrediction) {
      if (Array.isArray(parsedPrediction)) return String(parsedPrediction[0]);
      if (typeof parsedPrediction === 'object') return String(parsedPrediction.class ?? JSON.stringify(parsedPrediction));
      return String(parsedPrediction);
    }

    // 4
    if (parsedIssues && parsedIssues.length > 0) return String(parsedIssues[0]);

    return null;
  }, [diseaseInput, activeRecord, parsedPrediction, parsedIssues]);

  // disease info state and fetch status
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  const getDisplayText = (value) => {
    if (value === null || value === undefined || value === '') return 'Details not available';
    return String(value);
  };

  // Fetch disease info from FLASK_API_URL using diseaseName
  useEffect(() => {
    let mounted = true;
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
        const url = `${FLASK_API_URL.replace(/\/$/, '')}/api/disease`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ disease_name: diseaseName }),
        });

        const text = await res.text();
        let data = {};
        try {
          data = JSON.parse(text);
        } catch {
          data = {};
        }

        if (!mounted) return;

        if (res.ok && data?.info && Object.keys(data.info).length > 0) {
          setDiseaseInfo(data.info);
        } else if (data?.error) {
          setErrorInfo(data.error);
        } else {
          setErrorInfo('No detailed info available.');
        }
      } catch (e) {
        console.warn('Disease info fetch failed', e);
        if (!mounted) return;
        setErrorInfo('Failed to fetch disease information.');
      } finally {
        if (mounted) setLoadingInfo(false);
      }
    };

    fetchDiseaseInfo();
    return () => {
      mounted = false;
    };
  }, [isDiseaseDiagnosis, diseaseName]);

  // render UI
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disease Diagnosis</Text>
      </View>

      {/* Source info row */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Source</Text>
        <View style={[styles.detailCard, { paddingVertical: 10 }]}>
          <Text style={{ fontWeight: '700' }}>Device</Text>
          <Text>{deviceId ?? 'N/A'}</Text>

          {tempKey ? (
            <>
              <Text style={{ marginTop: 8, fontWeight: '700' }}>Stored Record Key</Text>
              <Text numberOfLines={1}>{tempKey}</Text>
            </>
          ) : null}

          {parsedRecordParam ? (
            <>
              <Text style={{ marginTop: 8, fontWeight: '700' }}>Record (param)</Text>
              <Text numberOfLines={2}>{typeof parsedRecordParam === 'string' ? parsedRecordParam : JSON.stringify(parsedRecordParam)}</Text>
            </>
          ) : null}

          {loadingRecord && <Text style={{ marginTop: 8 }}>Loading stored record...</Text>}
          {recordLoadError && <Text style={{ marginTop: 8, color: 'red' }}>{recordLoadError}</Text>}
        </View>
      </View>

      {/* Issues / predicted disease */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Issues Detected</Text>

        {diseaseName ? (
          <View style={styles.issueCard}>
            <Ionicons name="alert-circle" size={20} color="#F44336" />
            <Text style={styles.issueText}>{String(diseaseName)}</Text>
          </View>
        ) : parsedIssues.length > 0 ? (
          parsedIssues.map((issue, idx) => (
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
              { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 5 },
            ]}
          >
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.twoColumnLabel}>
                {getDisplayText(diseaseInfo['Days to Recovery'])}
              </Text>
              <Text style={styles.twoColumnValue}>Days to Recovery</Text>
            </View>
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
            { label: 'Impact on Yield', key: 'Impact on Yield' },
            { label: 'Natural Resolution', key: 'Natural Resolution' },
            { label: 'Chemical Resolution', key: 'Chemical Resolution' },
            { label: 'Cultural Resolution', key: 'Cultural control ' },
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
