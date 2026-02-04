import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Dimensions,
  Share,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";
import { FLASK_API_URL } from "../../constants/flaskapi";
import SafeScreen from "../../components/SafeScreen";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const PREDICT_API_URL = `${FLASK_API_URL}/api/predict`;
const CROP_API_URL = `${FLASK_API_URL}/api/crop`;
const rupee = "\u20B9";

function normalizePredictionResponse(respJson) {
  if (!respJson) return [];
  if (respJson.prediction && typeof respJson.prediction === "string") {
    return [{ name: respJson.prediction, confidence: null }];
  }
  if (Array.isArray(respJson.predictions)) {
    return respJson.predictions.map((it) => ({
      name: it.label || it.name || it.class || it.prediction || String(it),
      confidence: it.confidence ?? it.score ?? it.probability ?? null,
    }));
  }
  return [];
}

const NPKAnalysisPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [cropDetailsMap, setCropDetailsMap] = useState({});

  const queryParams = {
    N: params.N ?? "",
    P: params.P ?? "",
    K: params.K ?? "",
    temperature: params.temperature ?? "",
    humidity: params.humidity ?? "",
    ph: params.ph ?? "",
    rainfall: params.rainfall ?? "",
  };

  const handleShare = async () => {
    try {
      if (predictions.length === 0) return;
      
      const resultString = predictions
        .map(p => `${p.name}${p.confidence ? ` (${p.confidence <= 1 ? Math.round(p.confidence * 100) : Math.round(p.confidence)}% Match)` : ''}`)
        .join('\n- ');

      const message = `🌾 AgriVision Soil Analysis Report\n\n` +
        `📍 Soil Profile:\n` +
        `- Nitrogen: ${queryParams.N}\n` +
        `- Phosphorus: ${queryParams.P}\n` +
        `- Potassium: ${queryParams.K}\n` +
        `- pH Level: ${queryParams.ph}\n\n` +
        `✅ Top Recommendations:\n- ${resultString}\n\n` +
        `Generated via AgriVision AI - Intelligence for sustainable farming.`;
        
      await Share.share({
        message,
        title: 'AgriVision Soil Report',
      });
    } catch (error) {
      Alert.alert('Sharing Error', 'Unable to export results at this time.');
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchCropInfo = async (cropName) => {
      try {
        const r = await fetch(CROP_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ crop_name: cropName }),
        });
        const js = await r.json();
        return r.ok && js.info ? js.info : null;
      } catch { return null; }
    };

    const fetchPrediction = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(PREDICT_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(queryParams),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || "Prediction failed");
        const normalized = normalizePredictionResponse(data);
        if (!normalized.length) throw new Error("No recommendations found");
        if (cancelled) return;
        setPredictions(normalized);
        const names = [...new Set(normalized.map((p) => p.name))];
        for (const name of names) {
          const info = await fetchCropInfo(name);
          if (!cancelled) setCropDetailsMap((prev) => ({ ...prev, [name]: info }));
        }
      } catch (err) { if (!cancelled) setError(err.message); } 
      finally { if (!cancelled) setLoading(false); }
    };

    const allFilled = Object.values(queryParams).every((v) => v !== "");
    if (allFilled) fetchPrediction();
    else { setError("Missing soil data."); setLoading(false); }
    return () => { cancelled = true; };
  }, []);

  const renderCropCard = (item, idx) => {
    const cropInfo = cropDetailsMap[item.name];
    const c = item.confidence;
    const confPercent = c != null ? (c <= 1 ? `${Math.round(c * 100)}%` : `${Math.round(c)}%`) : "N/A";

    return (
      <View key={idx} style={[styles.cropCard, { backgroundColor: COLORS.cardBackground, borderColor: COLORS.border }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.cropIconBox, { backgroundColor: `${COLORS.primary}10` }]}>
            <Ionicons name="leaf" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.cropTitleInfo}>
            <Text style={[styles.cropName, { color: COLORS.textPrimary }]}>{item.name}</Text>
            <Text style={[styles.cropCategory, { color: COLORS.primary }]}>{cropInfo?.category || "Cereals & Grains"}</Text>
          </View>
          <View style={[styles.matchBadge, { backgroundColor: `${COLORS.success}15` }]}>
            <Text style={[styles.matchText, { color: COLORS.success }]}>{confPercent} Match</Text>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: COLORS.textTertiary }]}>Yield Potential</Text>
            <Text style={[styles.metricValue, { color: COLORS.textPrimary }]}>{cropInfo?.yield ? `${cropInfo.yield} Q/Acre` : "--"}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: COLORS.textTertiary }]}>Market Price</Text>
            <Text style={[styles.metricValue, { color: COLORS.textPrimary }]}>{rupee} {cropInfo?.price || "--"}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: COLORS.textTertiary }]}>Best Season</Text>
            <Text style={[styles.metricValue, { color: COLORS.textPrimary }]}>{cropInfo?.season || "Kharif"}</Text>
          </View>
        </View>

        <View style={[styles.descriptionBox, { backgroundColor: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }]}>
          <Text style={[styles.descriptionText, { color: COLORS.textSecondary }]}>
            {cropInfo?.description || `Optimal soil match found for ${item.name}. This crop thrives in your current environmental conditions.`}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.readFullBtn, { borderTopColor: COLORS.border }]}
          onPress={() => router.push({
            pathname: '/(pages)/growthblueprint',
            params: { cropName: item.name }
          })}
        >
          <Text style={{ color: COLORS.primary, fontWeight: '700' }}>View Growth Blueprint</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeScreen>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        
        {/* Modern Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: COLORS.cardBackground }]}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: COLORS.textPrimary }]}>Analysis Results</Text>
          <TouchableOpacity 
            onPress={handleShare}
            style={[styles.shareBtn, { backgroundColor: COLORS.cardBackground }]}
          >
            <Ionicons name="share-outline" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Soil Fingerprint Card */}
          <LinearGradient colors={[COLORS.primary, COLORS.primaryDark || "#248A3D"]} style={styles.soilFingerprint}>
            <View style={styles.fingerprintHeader}>
              <Text style={styles.fingerprintTitle}>Soil Fingerprint</Text>
              <View style={styles.liveBadge}><Text style={styles.liveText}>LAB VERIFIED</Text></View>
            </View>
            <View style={styles.npkRow}>
              {[
                { l: 'Nitrogen', v: queryParams.N, u: 'N' },
                { l: 'Phosphorus', v: queryParams.P, u: 'P' },
                { l: 'Potassium', v: queryParams.K, u: 'K' },
                { l: 'Soil pH', v: queryParams.ph, u: 'pH' }
              ].map((item, i) => (
                <View key={i} style={styles.npkMetric}>
                  <Text style={styles.npkVal}>{item.v}</Text>
                  <Text style={styles.npkLab}>{item.u}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>AI Recommendations</Text>
            <Text style={[styles.sectionSub, { color: COLORS.textTertiary }]}>Optimized for your specific soil composition</Text>
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={[styles.loadingText, { color: COLORS.textSecondary }]}>Synthesizing dataset...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={48} color={COLORS.error} />
              <Text style={[styles.errorText, { color: COLORS.textPrimary }]}>{error}</Text>
              <TouchableOpacity onPress={() => router.back()} style={[styles.retryBtn, { backgroundColor: COLORS.primary }]}>
                <Text style={styles.retryText}>Fix Soil Data</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.resultsList}>
              {predictions.map((p, i) => renderCropCard(p, i))}
            </View>
          )}

          <View style={[styles.footerBanner, { backgroundColor: `${COLORS.primary}05`, borderColor: `${COLORS.primary}20` }]}>
            <Ionicons name="information-circle" size={20} color={COLORS.primary} />
            <Text style={[styles.footerText, { color: COLORS.textSecondary }]}>
              These results are based on AI projections. Cross-verify with local environmental factors before planting.
            </Text>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  shareBtn: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  
  scrollContent: { padding: 20 },
  
  soilFingerprint: { padding: 24, borderRadius: 32, marginBottom: 32, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 }, android: { elevation: 8 } }) },
  fingerprintHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  fingerprintTitle: { color: '#FFF', fontSize: 16, fontWeight: '800', opacity: 0.9 },
  liveBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  liveText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  npkRow: { flexDirection: 'row', justifyContent: 'space-between' },
  npkMetric: { alignItems: 'center' },
  npkVal: { color: '#FFF', fontSize: 28, fontWeight: '900' },
  npkLab: { color: '#FFF', fontSize: 12, fontWeight: '700', opacity: 0.8, marginTop: 2 },

  sectionHeader: { marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '800' },
  sectionSub: { fontSize: 14, fontWeight: '500', marginTop: 4 },

  resultsList: { gap: 20 },
  cropCard: { borderRadius: 32, padding: 24, borderWidth: 1, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 16 }, android: { elevation: 2 } }) },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  cropIconBox: { width: 50, height: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  cropTitleInfo: { flex: 1, marginLeft: 16 },
  cropName: { fontSize: 19, fontWeight: '800' },
  cropCategory: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  matchBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  matchText: { fontSize: 12, fontWeight: '800' },

  metricsGrid: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  metricItem: { flex: 1, alignItems: 'center' },
  metricLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  metricValue: { fontSize: 15, fontWeight: '800' },
  metricDivider: { width: 1, height: 24, backgroundColor: 'rgba(0,0,0,0.05)' },

  descriptionBox: { padding: 16, borderRadius: 20, marginBottom: 20 },
  descriptionText: { fontSize: 14, lineHeight: 22, fontWeight: '500' },

  readFullBtn: { borderTopWidth: 1, paddingTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },

  loadingBox: { alignItems: 'center', paddingVertical: 60 },
  loadingText: { marginTop: 16, fontSize: 15, fontWeight: '600' },
  
  errorBox: { alignItems: 'center', paddingVertical: 40 },
  errorText: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginVertical: 20 },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16 },
  retryText: { color: '#FFF', fontWeight: '800' },

  footerBanner: { flexDirection: 'row', padding: 20, borderRadius: 24, borderWidth: 1, gap: 14, marginTop: 40 },
  footerText: { flex: 1, fontSize: 13, lineHeight: 20, fontWeight: '500' }
});

export default NPKAnalysisPage;
