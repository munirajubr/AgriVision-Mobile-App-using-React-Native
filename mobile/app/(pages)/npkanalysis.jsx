import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import COLORS from "../../constants/colors";
import { FLASK_API_URL } from "../../constants/flaskapi";
import styles from "../../assets/styles/npkanalysis.styles";

const PREDICT_API_URL = `${FLASK_API_URL}/api/predict`;

const NPKAnalysisPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState("");

  const queryParams = {
    N: params.N ?? "",
    P: params.P ?? "",
    K: params.K ?? "",
    temperature: params.temperature ?? "",
    humidity: params.humidity ?? "",
    pH: params.pH ?? "",
    rainfall: params.rainfall ?? "",
  };

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      setError(null);
      setPrediction("");
      try {
        const response = await fetch(PREDICT_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(queryParams),
        });
        const data = await response.json();

        if (response.ok && data.prediction) {
          setPrediction(data.prediction);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("Prediction failed. Unexpected server response.");
        }
      } catch (err) {
        setError("Network error: Could not fetch crop prediction.");
      } finally {
        setLoading(false);
      }
    };

    const areAllParamsFilled = Object.values(queryParams).every(
      (val) => val !== ""
    );
    if (areAllParamsFilled) {
      fetchPrediction();
    } else {
      setError("Missing required inputs for prediction.");
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>NPK Analysis</Text>
          </View>
        </View>

        {/* Soil Summary */}
        <View style={styles.soilSummary}>
          <Text style={styles.summaryTitle}>Soil Composition</Text>
          <View style={styles.npkContainer}>
            {["N", "P", "K", "pH"].map((item) => (
              <View key={item} style={styles.npkItem}>
                <Text style={styles.npkLabel}>{item}</Text>
                <Text style={styles.npkValue}>{queryParams[item] || "---"}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Prediction Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crop Recommendation</Text>
          <Text style={styles.sectionSubtitle}>
            Based on your soil NPK and environmental data.
          </Text>

          {loading && (
            <View style={{ marginVertical: 18, alignItems: "center" }}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={{ color: COLORS.textSecondary, marginTop: 8 }}>
                Fetching Prediction...
              </Text>
            </View>
          )}

          {!loading && error && (
            <Text style={{ color: "red", textAlign: "center", padding: 14 }}>
              {error}
            </Text>
          )}

          {!loading && !error && prediction && (
            <TouchableOpacity style={styles.cropCard} activeOpacity={0.7}>
              <View style={styles.cropCardHeader}>
                <View style={styles.cropInfo}>
                  <Text style={styles.cropName}>{prediction}</Text>
                  <Text style={styles.cropCategory}>Category Name</Text>
                </View>
                <View style={styles.cropStats}>
                  <Text style={styles.cropYield}>-- quintals/acre</Text>
                </View>
              </View>

              <View style={styles.cropCardBody}>
                <Text style={styles.detailText}>🌱 Season: --</Text>
                <Text style={styles.detailText}>💰 Avg Price: --</Text>
              </View>

              <Text
                style={styles.descriptionText}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                Description about {prediction} crop not available.
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Additional Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={COLORS.primary} />
          <Text style={styles.infoText}>
            This recommendation is based on your soil's NPK, pH, and weather data. Please consult local experts for field validation.
          </Text>
        </View>

        {/* Back to Home Button */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push("/(tabs)")}
          activeOpacity={0.8}
        >
          <Ionicons name="home" size={20} color="#fff" />
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default NPKAnalysisPage;