import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Modal,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/diagnosis.styles";

const PLANT_ID_KEY = process.env.PLANT_ID_API;
const PLANT_ID_URL = "https://api.plant.id/v2/identify";

const PlantAnalysisScreen = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageData, setSelectedImageData] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedPart, setSelectedPart] = useState("");
  const [showCropModal, setShowCropModal] = useState(false);
  const [showPartModal, setShowPartModal] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const cropTypes = [
    { id: "eggplant", name: "Eggplant", icon: "leaf-outline" },
    { id: "rice", name: "Rice", icon: "leaf-outline" },
    { id: "wheat", name: "Wheat", icon: "leaf-outline" },
    { id: "corn", name: "Corn", icon: "leaf-outline" },
    { id: "tomato", name: "Tomato", icon: "leaf-outline" },
    { id: "potato", name: "Potato", icon: "leaf-outline" },
    { id: "cotton", name: "Cotton", icon: "leaf-outline" },
    { id: "sugarcane", name: "Sugarcane", icon: "leaf-outline" },
    { id: "soybean", name: "Soybean", icon: "leaf-outline" },
  ];

  const plantParts = [
    { id: "leaf", name: "Leaf", icon: "leaf-outline" },
    { id: "fruit", name: "Fruit", icon: "leaf-outline" },
    { id: "flower", name: "Flower", icon: "flower-outline" },
    { id: "stem", name: "Stem", icon: "git-branch-outline" },
    { id: "root", name: "Root", icon: "git-network-outline" },
    { id: "seed", name: "Seed", icon: "ellipse-outline" },
  ];

  const requestPermissions = async () => {
    try {
      const camera = await ImagePicker.requestCameraPermissionsAsync();
      const media = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (camera?.status !== "granted" || media?.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera and photo library access are required."
        );
        return false;
      }
      return true;
    } catch (err) {
      Alert.alert("Permissions Error", String(err));
      return false;
    }
  };

  const openCamera = async () => {
    const ok = await requestPermissions();
    if (!ok) return;
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
    const ok = await requestPermissions();
    if (!ok) return;
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
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

  const getCropName = (id) => cropTypes.find((c) => c.id === id)?.name || id;
  const getPartName = (id) => plantParts.find((p) => p.id === id)?.name || id;

  // DISEASE IDENTIFICATION USING Plant.id API
  const submitForAnalysis = async () => {
    if (!selectedImageData || !selectedCrop || !selectedPart) {
      Alert.alert(
        "Missing Information",
        "Please select an image, crop type, and plant part."
      );
      return;
    }
    if (!PLANT_ID_KEY) {
      Alert.alert("Configuration Missing", "Plant.id API KEY is missing.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const organs = [getPartName(selectedPart).toLowerCase()];

      const body = {
        images: [`data:image/jpeg;base64,${selectedImageData}`],
        organs,
        // You can add additional optional fields like "disease_details": true, "all_results": true
      };

      const response = await fetch(PLANT_ID_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": PLANT_ID_KEY,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      let diseaseLabel = "Unknown";
      let confidenceLabel = 0;

      // Check if 'disease' suggestion is present
      if (
        result?.health_assessment?.is_healthy === false &&
        Array.isArray(result.disease_suggestions) &&
        result.disease_suggestions.length > 0
      ) {
        const topDisease = result.disease_suggestions[0];
        diseaseLabel =
          topDisease.name ||
          (topDisease.details &&
            topDisease.details.common_names &&
            topDisease.details.common_names[0]) ||
          "Plant Disease";
        confidenceLabel = Math.round((topDisease.probability || 0) * 100);
      } else if (
        result?.is_plant === true &&
        result?.suggestions &&
        result.suggestions.length > 0
      ) {
        // fallback to plant name
        diseaseLabel = result.suggestions[0].plant_name || "Identified Plant";
        confidenceLabel = Math.round(
          (result.suggestions[0].probability || 0) * 100
        );
      } else if (result.health_assessment?.is_healthy === true) {
        diseaseLabel = "Healthy";
        confidenceLabel = 99;
      }

      let health = diseaseLabel.toLowerCase().includes("healthy")
        ? "Good"
        : "Moderate";

      setAnalysisResult({
        health,
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

  const handleDiagnosisType = (type) => {
    setShowDiagnosisModal(false);
    if (!analysisResult) return;
    const params = {
      diagnosisType: type,
      crop: selectedCrop,
      part: selectedPart,
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

  const resetForm = () => {
    setSelectedImage(null);
    setSelectedImageData(null);
    setSelectedCrop("");
    setSelectedPart("");
    setAnalysisResult(null);
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
          <Text>Crop Selection</Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Crop Type</Text>
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={() => setShowCropModal(true)}
              disabled={isAnalyzing}
            >
              <View style={styles.selectionLeft}>
                <Ionicons
                  name="leaf-outline"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.selectionText}>
                  {selectedCrop
                    ? getCropName(selectedCrop)
                    : "Select Crop Type"}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {/* Plant Part Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Plant Part</Text>
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={() => setShowPartModal(true)}
              disabled={isAnalyzing}
            >
              <View style={styles.selectionLeft}>
                <Ionicons
                  name="git-branch-outline"
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.selectionText}>
                  {selectedPart
                    ? getPartName(selectedPart)
                    : "Select Plant Part"}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
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
                        analysisResult.health === "Good" ? "#4CAF50" : "#FF9800"
                      }
                    />
                    <Text style={styles.healthText}>
                      Health: {analysisResult.health}
                    </Text>
                  </View>
                </View>
                <View style={styles.resultSection}>
                  <Text style={styles.resultSectionTitle}>
                    Predicted Disease
                  </Text>
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
            {!analysisResult ? (
              isAnalyzing ? (
                <View style={styles.analyzingButton}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.analyzingText}>Analyzing...</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.analyzeButton}
                  onPress={submitForAnalysis}
                  disabled={isAnalyzing}
                >
                  <Ionicons name="search-outline" size={20} color="#fff" />
                  <Text style={styles.analyzeButtonText}>Analyse</Text>
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity
                style={styles.diagnosisButton}
                onPress={() => setShowDiagnosisModal(true)}
                disabled={isAnalyzing}
              >
                <Ionicons name="medical-outline" size={20} color="#fff" />
                <Text style={styles.diagnosisButtonText}>Get Diagnosis</Text>
              </TouchableOpacity>
            )}
            {(selectedImage || analysisResult) && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetForm}
                disabled={isAnalyzing}
              >
                <Ionicons
                  name="refresh-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.resetButtonText}>Start Over</Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Crop Modal */}
          <Modal visible={showCropModal} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Crop Type</Text>
                  <TouchableOpacity onPress={() => setShowCropModal(false)}>
                    <Ionicons
                      name="close"
                      size={24}
                      color={COLORS.textPrimary}
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalList}>
                  {cropTypes.map((crop) => (
                    <TouchableOpacity
                      key={crop.id}
                      style={styles.modalItem}
                      onPress={() => {
                        setSelectedCrop(crop.id);
                        setShowCropModal(false);
                      }}
                    >
                      <Ionicons
                        name={crop.icon}
                        size={24}
                        color={COLORS.primary}
                      />
                      <Text style={styles.modalItemText}>{crop.name}</Text>
                      {selectedCrop === crop.id && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={COLORS.primary}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
          {/* Part Modal */}
          <Modal visible={showPartModal} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Plant Part</Text>
                  <TouchableOpacity onPress={() => setShowPartModal(false)}>
                    <Ionicons
                      name="close"
                      size={24}
                      color={COLORS.textPrimary}
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.modalList}>
                  {plantParts.map((part) => (
                    <TouchableOpacity
                      key={part.id}
                      style={styles.modalItem}
                      onPress={() => {
                        setSelectedPart(part.id);
                        setShowPartModal(false);
                      }}
                    >
                      <Ionicons
                        name={part.icon}
                        size={24}
                        color={COLORS.primary}
                      />
                      <Text style={styles.modalItemText}>{part.name}</Text>
                      {selectedPart === part.id && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={COLORS.primary}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
          {/* Diagnosis Modal */}
          <Modal visible={showDiagnosisModal} animationType="fade" transparent>
            <View style={styles.diagnosisModalOverlay}>
              <View style={styles.diagnosisModalContent}>
                <View style={styles.diagnosisModalHeader}>
                  <Text style={styles.diagnosisModalTitle}>
                    Select Diagnosis Type
                  </Text>
                  <Text style={styles.diagnosisModalSubtitle}>
                    Choose your preferred treatment method
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.diagnosisTypeCard}
                  onPress={() => handleDiagnosisType("natural")}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.diagnosisTypeIcon,
                      { backgroundColor: "#4CAF5020" },
                    ]}
                  >
                    <Ionicons name="leaf" size={32} color="#4CAF50" />
                  </View>
                  <View style={styles.diagnosisTypeContent}>
                    <Text style={styles.diagnosisTypeName}>
                      Natural Diagnosis
                    </Text>
                    <Text style={styles.diagnosisTypeDescription}>
                      Organic and eco-friendly treatment solutions
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.diagnosisTypeCard}
                  onPress={() => handleDiagnosisType("chemical")}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.diagnosisTypeIcon,
                      { backgroundColor: "#2196F320" },
                    ]}
                  >
                    <Ionicons name="flask" size={32} color="#2196F3" />
                  </View>
                  <View style={styles.diagnosisTypeContent}>
                    <Text style={styles.diagnosisTypeName}>
                      Chemical Diagnosis
                    </Text>
                    <Text style={styles.diagnosisTypeDescription}>
                      Synthetic pesticides and fertilizers
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowDiagnosisModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlantAnalysisScreen;
