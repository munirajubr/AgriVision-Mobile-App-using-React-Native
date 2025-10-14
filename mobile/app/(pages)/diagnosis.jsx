import { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Alert, 
  ScrollView,
  Modal,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import COLORS from '../../constants/colors';

const PlantAnalysisScreen = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedPart, setSelectedPart] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [showPartModal, setShowPartModal] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Common crops for selection
  const cropTypes = [
    { id: 'rice', name: 'Rice', icon: 'leaf-outline' },
    { id: 'wheat', name: 'Wheat', icon: 'leaf-outline' },
    { id: 'corn', name: 'Corn', icon: 'leaf-outline' },
    { id: 'tomato', name: 'Tomato', icon: 'leaf-outline' },
    { id: 'potato', name: 'Potato', icon: 'leaf-outline' },
    { id: 'cotton', name: 'Cotton', icon: 'leaf-outline' },
    { id: 'sugarcane', name: 'Sugarcane', icon: 'leaf-outline' },
    { id: 'soybean', name: 'Soybean', icon: 'leaf-outline' },
  ];

  // Plant parts for analysis
  const plantParts = [
    { id: 'leaf', name: 'Leaf', icon: 'leaf-outline' },
    { id: 'fruit', name: 'Fruit', icon: 'leaf-outline' },
    { id: 'flower', name: 'Flower', icon: 'flower-outline' },
    { id: 'stem', name: 'Stem', icon: 'git-branch-outline' },
    { id: 'root', name: 'Root', icon: 'git-network-outline' },
    { id: 'seed', name: 'Seed', icon: 'ellipse-outline' },
  ];

  // Request camera permissions
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert('Permission Required', 'Camera and photo library access are required for this feature.');
      return false;
    }
    return true;
  };

  // Show image picker options
  const showImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add your plant image',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Photo Library', onPress: openImageLibrary },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Open camera
  const openCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Open image library
  const openImageLibrary = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Submit for analysis
  const submitForAnalysis = async () => {
    if (!selectedImage || !selectedCrop || !selectedPart) {
      Alert.alert('Missing Information', 'Please select an image, crop type, and plant part before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate API call (replace with actual analysis API)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock analysis result
      const mockResult = {
        health: 'Moderate',
        confidence: 87,
        issues: ['Leaf spot disease detected', 'Mild nutrient deficiency'],
        recommendations: [
          'Apply fungicide treatment',
          'Increase nitrogen fertilizer',
          'Ensure proper drainage'
        ]
      };
      
      setAnalysisResult(mockResult);
    } catch (error) {
      Alert.alert('Analysis Failed', 'Unable to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle diagnosis selection
  const handleDiagnosisType = (type) => {
  setShowDiagnosisModal(false);
  
  // Navigate to disease diagnosis page with data
  router.push({
    pathname: '/(pages)/diseasediagnosis',  // Changed from '/diagnosis' to '/diseasediagnosis'
    params: {
      diagnosisType: type,
      crop: selectedCrop,
      part: selectedPart,
      health: analysisResult.health,
      confidence: analysisResult.confidence,
      issues: JSON.stringify(analysisResult.issues),
      imageUri: selectedImage,
    }
  });
};


  // Reset form
  const resetForm = () => {
    setSelectedImage(null);
    setSelectedCrop('');
    setSelectedPart('');
    setAnalysisResult(null);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Image Upload Section */}
        <View style={styles.section}>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <TouchableOpacity style={styles.changeImageButton} onPress={showImagePicker}>
                <Ionicons name="camera" size={20} color="#fff" />
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={showImagePicker}>
              <Ionicons name="camera-outline" size={48} color={COLORS.primary} />
              <Text style={styles.uploadTitle}>Add Plant Image</Text>
              <Text style={styles.uploadSubtitle}>Tap to capture or upload from gallery</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Crop Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crop Type</Text>
          <TouchableOpacity 
            style={styles.selectionButton}
            onPress={() => setShowCropModal(true)}
          >
            <View style={styles.selectionLeft}>
              <Ionicons name="leaf-outline" size={24} color={COLORS.primary} />
              <Text style={styles.selectionText}>
                {selectedCrop ? cropTypes.find(c => c.id === selectedCrop)?.name : 'Select Crop Type'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Plant Part Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plant Part</Text>
          <TouchableOpacity 
            style={styles.selectionButton}
            onPress={() => setShowPartModal(true)}
          >
            <View style={styles.selectionLeft}>
              <Ionicons name="git-branch-outline" size={24} color={COLORS.primary} />
              <Text style={styles.selectionText}>
                {selectedPart ? plantParts.find(p => p.id === selectedPart)?.name : 'Select Plant Part'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Analysis Result */}
        {analysisResult && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Analysis Result</Text>
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={styles.healthIndicator}>
                  <Ionicons 
                    name={analysisResult.health === 'Good' ? 'checkmark-circle' : 'warning'} 
                    size={24} 
                    color={analysisResult.health === 'Good' ? '#4CAF50' : '#FF9800'} 
                  />
                  <Text style={styles.healthText}>Health: {analysisResult.health}</Text>
                </View>
                <Text style={styles.confidenceText}>Confidence: {analysisResult.confidence}%</Text>
              </View>

              {analysisResult.issues.length > 0 && (
                <View style={styles.resultSection}>
                  <Text style={styles.resultSectionTitle}>Issues Detected:</Text>
                  {analysisResult.issues.map((issue, index) => (
                    <Text key={index} style={styles.issueText}>• {issue}</Text>
                  ))}
                </View>
              )}

              <View style={styles.resultSection}>
                <Text style={styles.resultSectionTitle}>Recommendations:</Text>
                {analysisResult.recommendations.map((rec, index) => (
                  <Text key={index} style={styles.recommendationText}>• {rec}</Text>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {!analysisResult ? (
            // Show Analyze button if no results yet
            isAnalyzing ? (
              <View style={styles.analyzingButton}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.analyzingText}>Analyzing...</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.analyzeButton} onPress={submitForAnalysis}>
                <Ionicons name="search-outline" size={20} color="#fff" />
                <Text style={styles.analyzeButtonText}>Analyze Plant</Text>
              </TouchableOpacity>
            )
          ) : (
            // Show Diagnosis button after results
            <TouchableOpacity 
              style={styles.diagnosisButton} 
              onPress={() => setShowDiagnosisModal(true)}
            >
              <Ionicons name="medical-outline" size={20} color="#fff" />
              <Text style={styles.diagnosisButtonText}>Get Diagnosis</Text>
            </TouchableOpacity>
          )}

          {(selectedImage || analysisResult) && (
            <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
              <Ionicons name="refresh-outline" size={20} color={COLORS.primary} />
              <Text style={styles.resetButtonText}>Start Over</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Crop Selection Modal */}
      <Modal visible={showCropModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Crop Type</Text>
              <TouchableOpacity onPress={() => setShowCropModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
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
                  <Ionicons name={crop.icon} size={24} color={COLORS.primary} />
                  <Text style={styles.modalItemText}>{crop.name}</Text>
                  {selectedCrop === crop.id && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Plant Part Selection Modal */}
      <Modal visible={showPartModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Plant Part</Text>
              <TouchableOpacity onPress={() => setShowPartModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
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
                  <Ionicons name={part.icon} size={24} color={COLORS.primary} />
                  <Text style={styles.modalItemText}>{part.name}</Text>
                  {selectedPart === part.id && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Diagnosis Type Selection Modal */}
      <Modal visible={showDiagnosisModal} animationType="fade" transparent>
        <View style={styles.diagnosisModalOverlay}>
          <View style={styles.diagnosisModalContent}>
            <View style={styles.diagnosisModalHeader}>
              <Text style={styles.diagnosisModalTitle}>Select Diagnosis Type</Text>
              <Text style={styles.diagnosisModalSubtitle}>
                Choose your preferred treatment method
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.diagnosisTypeCard}
              onPress={() => handleDiagnosisType('natural')}
              activeOpacity={0.7}
            >
              <View style={[styles.diagnosisTypeIcon, { backgroundColor: '#4CAF5020' }]}>
                <Ionicons name="leaf" size={32} color="#4CAF50" />
              </View>
              <View style={styles.diagnosisTypeContent}>
                <Text style={styles.diagnosisTypeName}>Natural Diagnosis</Text>
                <Text style={styles.diagnosisTypeDescription}>
                  Organic and eco-friendly treatment solutions
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.diagnosisTypeCard}
              onPress={() => handleDiagnosisType('chemical')}
              activeOpacity={0.7}
            >
              <View style={[styles.diagnosisTypeIcon, { backgroundColor: '#2196F320' }]}>
                <Ionicons name="flask" size={32} color="#2196F3" />
              </View>
              <View style={styles.diagnosisTypeContent}>
                <Text style={styles.diagnosisTypeName}>Chemical Diagnosis</Text>
                <Text style={styles.diagnosisTypeDescription}>
                  Synthetic pesticides and fertilizers
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeImageText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  selectionButton: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  resultCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  healthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  confidenceText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  resultSection: {
    marginBottom: 16,
  },
  resultSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  issueText: {
    fontSize: 14,
    color: '#F44336',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: 32,
    gap: 12,
  },
  analyzeButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  analyzingButton: {
    backgroundColor: COLORS.textSecondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  analyzingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  diagnosisButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  diagnosisButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resetButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  resetButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  modalList: {
    paddingHorizontal: 20,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalItemText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  // Diagnosis Modal Styles
  diagnosisModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  diagnosisModalContent: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  diagnosisModalHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  diagnosisModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  diagnosisModalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  diagnosisTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  diagnosisTypeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  diagnosisTypeContent: {
    flex: 1,
  },
  diagnosisTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  diagnosisTypeDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  cancelButton: {
    marginTop: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});

export default PlantAnalysisScreen;
