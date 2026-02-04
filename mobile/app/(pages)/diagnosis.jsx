import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { getColors } from "../../constants/colors";
import { useThemeStore } from "../../store/themeStore";
import SafeScreen from "../../components/SafeScreen";
import PageHeader from "../../components/PageHeader";

const BASE_URL = "https://eggplant-disease-detection-model.onrender.com"; 

export default function PlantAnalysisScreen() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageData, setSelectedImageData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const requestPermissions = async () => {
    const { status: camera } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: media } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (camera !== "granted" || media !== "granted") {
      Alert.alert("Permission Required", "Camera and gallery access are needed.");
      return false;
    }
    return true;
  };

  const pickImage = async (useCamera = false) => {
    if (!(await requestPermissions())) return;
    try {
      const options = { allowsEditing: true, quality: 0.8, base64: true };
      const res = useCamera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
      if (!res.canceled && res.assets?.length > 0) {
        setSelectedImage(res.assets[0].uri);
        setSelectedImageData(res.assets[0].base64);
        setAnalysisResult(null);
      }
    } catch (err) { Alert.alert("Error", "Could not access image."); }
  };

  const submitForAnalysis = async () => {
    if (!selectedImageData) return;
    setIsAnalyzing(true);
    try {
      const resp = await fetch(`${BASE_URL}/predict/base64`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: `data:image/jpeg;base64,${selectedImageData}` }),
      });
      const data = await resp.json();
      if (!data.success) throw new Error(data.error || "Analysis failed");
      setAnalysisResult({
        class: data.prediction?.class || "Healthy",
        confidence: Math.round((data.prediction?.confidence || 0) * 100),
        recommendations: data.disease_info?.recommendations || ["Regular monitoring is advised."]
      });
    } catch (err) { Alert.alert("Fail", "Server is busy. Please try again later."); } finally { setIsAnalyzing(false); }
  };

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <PageHeader title="AI Scan" />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Visualizer Area */}
          <View style={[styles.visualizer, { backgroundColor: COLORS.cardBackground }]}>
            {selectedImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                <View style={styles.scanOverlay}>
                   <View style={[styles.scanLine, { backgroundColor: COLORS.primary }]} />
                </View>
                <TouchableOpacity style={styles.retakeBtn} onPress={() => setSelectedImage(null)}>
                  <Ionicons name="close-circle" size={32} color="#FFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadOptions}>
                <TouchableOpacity style={[styles.uploadBox, { backgroundColor: `${COLORS.primary}08` }]} onPress={() => pickImage(true)}>
                  <Ionicons name="camera" size={32} color={COLORS.primary} />
                  <Text style={[styles.uploadText, { color: COLORS.textPrimary }]}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.uploadBox, { backgroundColor: `${COLORS.info}08` }]} onPress={() => pickImage(false)}>
                  <Ionicons name="images" size={32} color={COLORS.info} />
                  <Text style={[styles.uploadText, { color: COLORS.textPrimary }]}>Gallery</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Analysis Action */}
          {selectedImage && !analysisResult && (
            <TouchableOpacity 
              style={[styles.mainActionBtn, { backgroundColor: COLORS.primary }]} 
              onPress={submitForAnalysis} 
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#FFF" />
                  <Text style={styles.actionText}>Scanning Tissues...</Text>
                </View>
              ) : (
                <View style={styles.loadingRow}>
                  <Ionicons name="sparkles" size={24} color="#FFF" />
                  <Text style={styles.actionText}>Run AI Diagnosis</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Advanced Results UI */}
          {analysisResult && (
            <View style={styles.resultsWrapper}>
              <View style={[styles.resultHeaderCard, { backgroundColor: COLORS.cardBackground }]}>
                <View style={styles.resultTypeRow}>
                  <View style={[styles.statusIndicator, { backgroundColor: analysisResult.class.toLowerCase().includes('healthy') ? COLORS.success : COLORS.error }]} />
                  <Text style={[styles.resultTitle, { color: COLORS.textPrimary }]}>{analysisResult.class}</Text>
                </View>
                <View style={styles.confidenceBarContainer}>
                  <View style={styles.confidenceLabelRow}>
                    <Text style={[styles.confText, { color: COLORS.textTertiary }]}>Confidence Level</Text>
                    <Text style={[styles.confVal, { color: COLORS.primary }]}>{analysisResult.confidence}%</Text>
                  </View>
                  <View style={[styles.progressBarBg, { backgroundColor: COLORS.secondaryBackground }]}>
                    <View style={[styles.progressBarFill, { width: `${analysisResult.confidence}%`, backgroundColor: COLORS.primary }]} />
                  </View>
                </View>
              </View>

              <Text style={[styles.sectionTitle, { color: COLORS.textPrimary }]}>Treatment Protocol</Text>
              {analysisResult.recommendations.map((rec, i) => (
                <View key={i} style={[styles.recCard, { backgroundColor: COLORS.cardBackground }]}>
                   <View style={[styles.stepDot, { backgroundColor: COLORS.primary }]}>
                     <Text style={styles.stepNum}>{i + 1}</Text>
                   </View>
                   <Text style={[styles.recContent, { color: COLORS.textSecondary }]}>{rec}</Text>
                </View>
              ))}

              <TouchableOpacity 
                style={[styles.pathologyBtn, { backgroundColor: COLORS.primary }]} 
                onPress={() => router.push(`/(pages)/diseasediagnosis?prediction=${encodeURIComponent(analysisResult.class)}`)}
              >
                <Text style={styles.pathologyBtnText}>View Full Pathology</Text>
                <Ionicons name="book-outline" size={18} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.resetBtn, { backgroundColor: `${COLORS.textTertiary}15` }]} 
                onPress={() => { setSelectedImage(null); setAnalysisResult(null); }}
              >
                <Text style={[styles.resetText, { color: COLORS.textPrimary }]}>New Scan</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  visualizer: { height: 320, borderRadius: 32, overflow: 'hidden', marginBottom: 24, justifyContent: 'center' },
  imageContainer: { flex: 1, position: 'relative' },
  previewImage: { width: '100%', height: '100%' },
  scanOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center' },
  scanLine: { height: 2, width: '100%', opacity: 0.5, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10 },
  retakeBtn: { position: 'absolute', top: 20, right: 20 },
  uploadOptions: { flexDirection: 'row', gap: 16, padding: 20 },
  uploadBox: { flex: 1, height: 140, borderRadius: 24, alignItems: 'center', justifyContent: 'center', gap: 12 },
  uploadText: { fontSize: 15, fontWeight: '700' },
  mainActionBtn: { height: 68, borderRadius: 24, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 15 }, android: { elevation: 4 } }) },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  resultsWrapper: { gap: 20 },
  resultHeaderCard: { padding: 24, borderRadius: 28 },
  resultTypeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  statusIndicator: { width: 12, height: 12, borderRadius: 6 },
  resultTitle: { fontSize: 22, fontWeight: '800' },
  confidenceBarContainer: { gap: 10 },
  confidenceLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  confText: { fontSize: 13, fontWeight: '600' },
  confVal: { fontSize: 15, fontWeight: '800' },
  progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  sectionTitle: { fontSize: 19, fontWeight: '800', marginTop: 10, marginLeft: 4 },
  recCard: { padding: 18, borderRadius: 24, flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  stepDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepNum: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  recContent: { flex: 1, fontSize: 15, lineHeight: 22, fontWeight: '500' },
  pathologyBtn: { height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 },
  pathologyBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  resetBtn: { height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  resetText: { fontSize: 16, fontWeight: '700' }
});
