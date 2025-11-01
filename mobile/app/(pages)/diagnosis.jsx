import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/diagnosis.styles";

const BASE_URL = "https://eggplant-disease-detection-model.onrender.com";

export default function PlantAnalysisScreen() {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageData, setSelectedImageData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [topPredictions, setTopPredictions] = useState([]);

  const requestPermissions = async () => {
    try {
      const camera = await ImagePicker.requestCameraPermissionsAsync();
      const media = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (camera.status !== "granted" || media.status !== "granted") {
        Alert.alert("Permission Required", "Camera and photo library access are required.");
        return false;
      }
      return true;
    } catch (err) {
      Alert.alert("Permissions Error", String(err));
      return false;
    }
  };

  const openCamera = async () => {
    if (!(await requestPermissions())) return;
    try {
      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
        base64: true,
      });
      if (!res.canceled && res.assets?.length > 0) {
        setSelectedImage(res.assets[0].uri);
        setSelectedImageData(res.assets[0].base64 || null);
      }
    } catch (err) {
      Alert.alert("Camera Error", String(err));
    }
  };

  const openImageLibrary = async () => {
    if (!(await requestPermissions())) return;
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.85,
        base64: true,
      });
      if (!res.canceled && res.assets?.length > 0) {
        setSelectedImage(res.assets[0].uri);
        setSelectedImageData(res.assets[0].base64 || null);
      }
    } catch (err) {
      Alert.alert("Gallery Error", String(err));
    }
  };

  const showImagePicker = () => {
    Alert.alert("Select Image", "Choose how to add your plant image", [
      { text: "Camera", onPress: openCamera },
      { text: "Photo Library", onPress: openImageLibrary },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  useEffect(() => {
    if (selectedImageData) {
      submitForAnalysis();
    }
  }, [selectedImageData]);

  const submitForAnalysis = async () => {
    if (!selectedImageData) return;
    if (!BASE_URL) {
      Alert.alert("Configuration Missing", "ML model BASE_URL is not configured.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setTopPredictions([]);

    try {
      const resp = await fetch(`${BASE_URL}/predict/base64`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: `data:image/jpeg;base64,${selectedImageData}`,
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`API ${resp.status}: ${text}`);
      }

      const data = await resp.json();
      if (!data.success) throw new Error(data.error || "Prediction failed");

      const label = data.prediction?.class || "Unknown";
      const confidence = data.prediction?.confidence ?? 0;
      const confidencePct = Math.round(confidence * 100);
      const health = String(label).toLowerCase().includes("healthy") ? "Good" : "Moderate";
      const recommendations = Array.isArray(data.disease_info?.recommendations)
        ? data.disease_info.recommendations
        : [];

      setAnalysisResult({
        health,
        confidence: confidencePct,
        issues: [label],
        recommendations,
        raw: data,
      });

      setTopPredictions(data.all_predictions || []);
    } catch (err) {
      Alert.alert("Analysis Failed", err.message || String(err));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const navigateToDiagnosis = () => {
    if (!analysisResult) return;
    const params = {
      diagnosisType: "model",
      crop: "",
      part: "",
      health: analysisResult.health,
      confidence: String(analysisResult.confidence),
      issues: JSON.stringify(analysisResult.issues),
      imageUri: selectedImage,
    };
    const qs = Object.keys(params)
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join("&");
    router.push(`/(pages)/diseasediagnosis?${qs}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Image Upload */}
          <View style={styles.section}>
            {selectedImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={showImagePicker}
                  disabled={isAnalyzing}
                >
                  <Ionicons name="camera" size={20} color="#fff" />
                  <Text style={styles.changeImageText}>Change Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={showImagePicker}
                disabled={isAnalyzing}
              >
                <Ionicons name="camera-outline" size={48} color={COLORS.primary} />
                <Text style={styles.uploadTitle}>Add Plant Image</Text>
                <Text style={styles.uploadSubtitle}>
                  Tap to capture or upload from gallery
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Analysis Result */}
          {analysisResult && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Disease Prediction</Text>
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View style={styles.healthIndicator}>
                    <Ionicons
                      name={analysisResult.health === "Good" ? "checkmark-circle" : "warning"}
                      size={24}
                      color={analysisResult.health === "Good" ? "#4CAF50" : "#FF9800"}
                    />
                    <Text style={styles.healthText}>Health: {analysisResult.health}</Text>
                  </View>
                </View>
                <View style={styles.resultSection}>
                  <Text style={styles.resultSectionTitle}>Predicted Disease</Text>
                  {analysisResult.issues.map((item, idx) => (
                    <Text key={idx} style={styles.issueText}>• {item}</Text>
                  ))}
                  <Text style={styles.confidenceText}>Confidence: {analysisResult.confidence}%</Text>

                  {analysisResult.recommendations?.length > 0 && (
                    <View style={{ marginTop: 8 }}>
                      <Text style={styles.resultSectionTitle}>Recommendations</Text>
                      {analysisResult.recommendations.map((r, i) => (
                        <Text key={i} style={styles.recommendationText}>• {r}</Text>
                      ))}
                    </View>
                  )}

                  {/* Top-5 predictions section */}
                  {topPredictions.length > 0 && (
                    <View style={{ marginTop: 12 }}>
                      <Text style={[styles.resultSectionTitle, { fontWeight: 'bold' }]}>Top-5 Predictions</Text>
                      {topPredictions.map((item, index) => (
                        <Text key={index} style={{ marginVertical: 2 }}>
                          • {item.class} — {(item.confidence * 100).toFixed(2)}%
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={submitForAnalysis}
              disabled={isAnalyzing || (!selectedImageData && !selectedImage)}
            >
              {isAnalyzing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="search-outline" size={20} color="#fff" />
              )}
              <Text style={styles.analyzeButtonText}>
                {isAnalyzing ? "Analyzing..." : "Analyse"}
              </Text>
            </TouchableOpacity>

            {analysisResult && (
              <TouchableOpacity
                style={styles.diagnosisButton}
                onPress={navigateToDiagnosis}
                disabled={isAnalyzing}
              >
                <Ionicons name="medical-outline" size={20} color="#fff" />
                <Text style={styles.diagnosisButtonText}>Get Diagnosis</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
