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

const CROP_HEALTH_KEY = process.env.CROP_HEALTH_API;
const CROP_HEALTH_URL = "https://crop.kindwise.com/api/v1/identification";

const PlantAnalysisScreen = () => {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageData, setSelectedImageData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

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
        quality: 0.8,
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
        quality: 0.8,
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
    if (!CROP_HEALTH_KEY) {
      Alert.alert("Configuration Missing", "Crop.health API KEY is missing.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const body = {
        images: [`data:image/jpeg;base64,${selectedImageData}`],
      };

      const response = await fetch(CROP_HEALTH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": CROP_HEALTH_KEY,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        throw new Error(`API request failed with status ${response.status}, body: ${errorText}`);
      }

      const result = await response.json();
      // console.log("Full API response:", result); 

      const diseaseSuggestions = result.result?.disease?.suggestions || [];
      const cropSuggestions = result.result?.crop?.suggestions || [];
      const isPlant = result.result?.is_plant;

      let diseaseLabel = "";
      let confidenceLabel = 0;

      if (diseaseSuggestions.length > 0) {
        const topDisease = diseaseSuggestions[0];
        diseaseLabel =
          topDisease.name ||
          (topDisease.details?.common_names?.[0]) ||
          "Plant Disease";
        confidenceLabel = Math.round((topDisease.probability || 0) * 100);
      } else if (isPlant?.binary === true && cropSuggestions.length > 0) {
        diseaseLabel = cropSuggestions[0].plant_name || "Identified Plant";
        confidenceLabel = Math.round((cropSuggestions[0].probability || 0) * 100);
      } else {
        diseaseLabel = "Unknown";
      }

      const healthStatus = diseaseLabel.toLowerCase().includes("healthy") ? "Good" : "Moderate";

      setAnalysisResult({
        health: healthStatus,
        confidence: confidenceLabel,
        issues: [diseaseLabel],
        recommendations: [],
      });
    } catch (err) {
      Alert.alert("Analysis Failed", err.message || String(err));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const navigateToDiagnosis = () => {
    if (!analysisResult) return;
    const params = {
      diagnosisType: "natural",
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
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.selectedImage}
                />
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
                <Ionicons
                  name="camera-outline"
                  size={48}
                  color={COLORS.primary}
                />
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
                      name={
                        analysisResult.health === "Good"
                          ? "checkmark-circle"
                          : "warning"
                      }
                      size={24}
                      color={
                        analysisResult.health === "Good"
                          ? "#4CAF50"
                          : "#FF9800"
                      }
                    />
                    <Text style={styles.healthText}>
                      Health: {analysisResult.health}
                    </Text>
                  </View>
                </View>
                <View style={styles.resultSection}>
                  <Text style={styles.resultSectionTitle}>Predicted Disease</Text>
                  {analysisResult.issues.map((item, idx) => (
                    <Text key={idx} style={styles.issueText}>
                      • {item}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          )}
          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={submitForAnalysis}
              disabled={isAnalyzing || !selectedImageData}
            >
              {isAnalyzing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="search-outline" size={20} color="#fff" />
              )}
              <Text style={styles.analyzeButtonText}>Analyse</Text>
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
};

export default PlantAnalysisScreen;
