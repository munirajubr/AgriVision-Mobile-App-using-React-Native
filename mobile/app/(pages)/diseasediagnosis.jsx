import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import { FLASK_API_URL } from '../../constants/flaskapi';
import SafeScreen from '../../components/SafeScreen';
import PageHeader from '../../components/PageHeader';

const DiseaseDiagnosisPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  const deviceId = params?.deviceId ?? null;
  const tempKey = params?.tempKey ?? null;
  const rawRecord = params?.record ?? null;
  const rawPrediction = params?.prediction ?? null;

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [error, setError] = useState(null);

  // 1. Resolve the data record
  useEffect(() => {
    (async () => {
      try {
        if (tempKey) {
          const raw = await AsyncStorage.getItem(tempKey);
          if (raw) setRecord(JSON.parse(raw));
        } else if (rawRecord) {
          setRecord(typeof rawRecord === 'string' ? JSON.parse(rawRecord) : rawRecord);
        }
      } catch (e) {
        console.warn('Record parsing failed', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [tempKey, rawRecord]);

  // 2. Resolve the disease name
  const diseaseName = useMemo(() => {
    if (rawPrediction) return String(decodeURIComponent(rawPrediction));
    if (record) {
      const p = record.prediction ?? record.predicted_class ?? record.model_prediction ?? record.class ?? null;
      if (p) return typeof p === 'object' ? (p.class ?? p.label) : String(p);
    }
    return null;
  }, [record, rawPrediction]);

  // 3. Fetch detailed disease info
  useEffect(() => {
    if (!diseaseName) return;

    const fetchInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${FLASK_API_URL.replace(/\/$/, '')}/api/disease`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ disease_name: diseaseName }),
        });
        const data = await res.json();
        if (res.ok && data.info) {
          setDiseaseInfo(data.info);
        } else {
          setError(data.error || 'Detailed pathology data not available for this condition.');
        }
      } catch (e) {
        setError('Network connectivity issues. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [diseaseName]);

  const ResolutionCard = ({ title, content, icon, color }) => (
    <View style={[styles.resCard, { backgroundColor: COLORS.cardBackground }]}>
      <View style={styles.resHeader}>
        <View style={[styles.resIcon, { backgroundColor: `${color}10` }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={[styles.resTitle, { color: COLORS.textPrimary }]}>{title}</Text>
      </View>
      <Text style={[styles.resContent, { color: COLORS.textSecondary }]}>{content || 'Information pending further analysis.'}</Text>
    </View>
  );

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <PageHeader title="Analysis Result" />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loaderCenter}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={[styles.loaderText, { color: COLORS.textTertiary }]}>Analyzing Pathology Data...</Text>
            </View>
          ) : (
            <>
              {/* Clean Identification Section */}
              <View style={styles.idContainer}>
                <Text style={[styles.idLabel, { color: COLORS.textTertiary }]}>CONDITION IDENTIFIED</Text>
                <Text style={[styles.idValue, { color: COLORS.textPrimary }]}>{diseaseName || 'Healthy State'}</Text>
                
                <View style={[styles.sourceBadge, { backgroundColor: COLORS.cardBackground }]}>
                  <Ionicons name={deviceId ? "hardware-chip" : "scan"} size={14} color={COLORS.primary} />
                  <Text style={[styles.sourceText, { color: COLORS.textSecondary }]}>
                    Source: {deviceId ? `Sensor #${deviceId}` : 'Vision Pro'}
                  </Text>
                </View>
              </View>

              {/* Status Bar Row */}
              <View style={styles.metricsRow}>
                <View style={[styles.metricCard, { backgroundColor: COLORS.cardBackground }]}>
                  <Text style={[styles.metricVal, { color: COLORS.error }]}>{diseaseInfo?.['Severity Level'] || 'Low'}</Text>
                  <Text style={[styles.metricLab, { color: COLORS.textTertiary }]}>Severity</Text>
                </View>
                <View style={[styles.metricCard, { backgroundColor: COLORS.cardBackground }]}>
                  <Text style={[styles.metricVal, { color: COLORS.primary }]}>{diseaseInfo?.['Days to Recovery'] || 'N/A'}</Text>
                  <Text style={[styles.metricLab, { color: COLORS.textTertiary }]}>Est. Recovery</Text>
                </View>
              </View>

              {/* Problem Description */}
              <View style={[styles.descCard, { backgroundColor: `${COLORS.primary}05` }]}>
                <View style={styles.descHeader}>
                  <Ionicons name="information-circle" size={22} color={COLORS.primary} />
                  <Text style={[styles.descTitle, { color: COLORS.textPrimary }]}>Case Summary</Text>
                </View>
                <Text style={[styles.descText, { color: COLORS.textSecondary }]}>
                  {diseaseInfo?.['Symptoms Description'] || 'The plant tissues appear consistent with normal physiological development. Continue regular monitoring.'}
                </Text>
              </View>

              <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Recovery Protocols</Text>

              {error ? (
                <View style={styles.errorBox}>
                  <Ionicons name="help-buoy-outline" size={40} color={COLORS.textTertiary} />
                  <Text style={[styles.errorText, { color: COLORS.textSecondary }]}>{error}</Text>
                </View>
              ) : (
                <View style={styles.resolutionsList}>
                  <ResolutionCard 
                    title="Impact Assessment" 
                    content={diseaseInfo?.['Impact on Yield']} 
                    icon="trending-down" 
                    color={COLORS.error} 
                  />
                  <ResolutionCard 
                    title="Natural Mitigation" 
                    content={diseaseInfo?.['Natural Resolution']} 
                    icon="leaf" 
                    color={COLORS.success} 
                  />
                  <ResolutionCard 
                    title="Chemical Control" 
                    content={diseaseInfo?.['Chemical Resolution']} 
                    icon="flask" 
                    color={COLORS.info} 
                  />
                </View>
              )}

              <TouchableOpacity 
                style={[styles.finishBtn, { backgroundColor: COLORS.primary }]} 
                onPress={() => router.back()}
              >
                <Text style={styles.finishBtnText}>Acknowledge & Save</Text>
              </TouchableOpacity>
            </>
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24 },
  loaderCenter: { marginTop: 100, alignItems: 'center', gap: 20 },
  loaderText: { fontSize: 16, fontWeight: '600' },
  
  idContainer: { alignItems: 'center', marginBottom: 32 },
  idLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  idValue: { fontSize: 34, fontWeight: '800', textAlign: 'center', marginBottom: 16 },
  sourceBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  sourceText: { fontSize: 12, fontWeight: '700' },

  metricsRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  metricCard: { flex: 1, padding: 20, borderRadius: 24, alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10 }, android: { elevation: 1 } }) },
  metricVal: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  metricLab: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

  descCard: { padding: 24, borderRadius: 28, marginBottom: 32 },
  descHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  descTitle: { fontSize: 18, fontWeight: '800' },
  descText: { fontSize: 15, lineHeight: 24, fontWeight: '500' },

  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 16, marginLeft: 4 },
  resolutionsList: { gap: 16 },
  resCard: { padding: 20, borderRadius: 24 },
  resHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  resIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  resTitle: { fontSize: 16, fontWeight: '700' },
  resContent: { fontSize: 14, lineHeight: 22, fontWeight: '500' },

  errorBox: { alignItems: 'center', padding: 40, gap: 12 },
  errorText: { textAlign: 'center', fontSize: 14, fontWeight: '500', lineHeight: 20 },
  
  finishBtn: { height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 40, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15 }, android: { elevation: 4 } }) },
  finishBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' }
});

export default DiseaseDiagnosisPage;
