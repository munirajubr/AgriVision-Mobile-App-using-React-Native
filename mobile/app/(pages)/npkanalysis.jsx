import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import COLORS from "../../constants/colors";
import { FLASK_API_URL } from "../../constants/flaskapi";
import styles from "../../assets/styles/npkanalysis.styles";

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
      name:
        it.label ||
        it.name ||
        it.class ||
        it.prediction ||
        String(it),
      confidence: it.confidence ?? it.score ?? it.probability ?? null,
    }));
  }
  return [];
}

const NPKAnalysisPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

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
      } catch {
        return null;
      }
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
        if (!normalized.length) throw new Error("Invalid model response");

        if (cancelled) return;

        setPredictions(normalized);

        // Fetch details for each
        const names = [...new Set(normalized.map((p) => p.name))];
        for (const name of names) {
          const info = await fetchCropInfo(name);
          if (!cancelled) {
            setCropDetailsMap((prev) => ({ ...prev, [name]: info }));
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const allFilled = Object.values(queryParams).every((v) => v !== "");
    if (allFilled) fetchPrediction();
    else {
      setError("Missing required inputs.");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const renderCropCard = (item, idx) => {
    const cropInfo = cropDetailsMap[item.name];
    const c = item.confidence;
    const confPercent =
      c != null ? (c <= 1 ? `${Math.round(c * 100)}%` : `${Math.round(c)}%`) : "--";

    return (
      <View
        key={idx}
        style={[
          styles.cropCard,
          { marginBottom: 12, padding: 12, borderRadius: 14 },
        ]}
      >
        <View style={styles.cropCardHeader}>
          <View style={styles.cropInfo}>
            <Text style={styles.cropName}>{item.name}</Text>
            <Text style={styles.cropCategory}>{cropInfo?.category ?? "Category"}</Text>
          </View>
          <View style={styles.cropStats}>
            <Text style={styles.cropYield}>
              {cropInfo?.yield ? cropInfo.yield + " quintals/acre" : "--"}
            </Text>
          </View>
        </View>

        <View style={[styles.cropCardBody, { marginTop: 10 }]}>
          <Text style={styles.detailText}>🌱 Season: {cropInfo?.season ?? "--"}</Text>
          <Text style={styles.detailText}>💰 Price: {rupee} {cropInfo?.price ?? "--"}  per quintal</Text>
          <Text style={styles.detailText}>📊 Confidence: {confPercent}</Text>
        </View>

        <Text
          style={[styles.descriptionText, { marginTop: 10 }]}
          numberOfLines={3}
        >
          {cropInfo?.description ??
            `Description for ${item.name} not available.`}
        </Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { marginBottom: 10 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NPK Analysis</Text>
        </View>

        {/* Soil Summary */}
        <View style={[styles.soilSummary, { marginBottom: 20 }]}>
          <Text style={styles.summaryTitle}>Soil Composition</Text>
          <View style={styles.npkContainer}>
            {["N", "P", "K", "ph"].map((item) => (
              <View key={item} style={styles.npkItem}>
                <Text style={styles.npkLabel}>{item}</Text>
                <Text style={styles.npkValue}>{queryParams[item] || "--"}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Prediction section */}
        <View style={[styles.section, { marginBottom: 20 }]}>
          <Text style={styles.sectionTitle}>Crop Recommendation</Text>
          <Text style={styles.sectionSubtitle}>
            Based on your soil data & environment.
          </Text>

          {loading && (
            <View style={{ marginVertical: 20, alignItems: "center" }}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={{ marginTop: 8, color: COLORS.textSecondary }}>
                Fetching results...
              </Text>
            </View>
          )}

          {!!error && !loading && (
            <Text
              style={{
                color: "red",
                textAlign: "center",
                padding: 10,
                marginTop: 10,
              }}
            >
              {error}
            </Text>
          )}

          {!loading && !error && predictions.length > 0 && (
            <View style={{ marginTop: 10 }}>
              {predictions.map((p, i) => renderCropCard(p, i))}
            </View>
          )}
        </View>

        {/* Info Card */}
        <View
          style={[
            styles.infoCard,
            { marginTop: 10, marginBottom: 25, paddingVertical: 14 },
          ]}
        >
          <Ionicons name="information-circle" size={24} color={COLORS.primary} />
          <Text style={[styles.infoText, { marginLeft: 10 }]}>
            These recommendations are model-based. Please verify with local
            agricultural experts.
          </Text>
        </View>

        {/* Home Button */}
        <TouchableOpacity
          style={[styles.homeButton, { marginBottom: 10 }]}
          onPress={() => router.push("/(tabs)")}
        >
          <Ionicons name="home" size={20} color="#fff" />
          <Text style={styles.homeButtonText}>Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default NPKAnalysisPage;
