import { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import COLORS from '../../constants/colors';

const NPKUploadPage = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  
  // Form data states
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    pH: '',
    organicCarbon: '',
    sulfur: '',
    zinc: '',
    boron: '',
    iron: '',
    manganese: '',
    copper: '',
    availableN: '',
    availableP: '',
    availableK: '',
    requiredN: '',
    requiredP: '',
    requiredK: '',
  });

  // Pick PDF document
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        processPDF(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
      console.error(error);
    }
  };

  // Process PDF and extract NPK data
  const processPDF = async (file) => {
    setIsProcessing(true);
    
    try {
      // Simulate PDF processing (replace with actual OCR/PDF parsing)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted data from PDF
      const mockData = {
        nitrogen: '245',
        phosphorus: '32',
        potassium: '180',
        pH: '6.8',
        organicCarbon: '0.65',
        sulfur: '18',
        zinc: '2.4',
        boron: '0.8',
        iron: '12',
        manganese: '8',
        copper: '1.5',
        availableN: '245',
        availableP: '32',
        availableK: '180',
        requiredN: '280',
        requiredP: '60',
        requiredK: '240',
      };
      
      setExtractedData(mockData);
      setFormData(mockData);
      
      Alert.alert(
        'Success', 
        'Soil report data extracted successfully!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process PDF. Please enter data manually.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Update form field
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get crop suggestions
  const getCropSuggestions = () => {
    if (!formData.nitrogen || !formData.phosphorus || !formData.potassium) {
      Alert.alert('Missing Data', 'Please upload a soil report or enter NPK values manually.');
      return;
    }

    // Navigate to suggestions page
    router.push({
      pathname: '/(pages)/npkanalysis',
      params: {
        ...formData,
        fileName: selectedFile?.name || 'Manual Entry',
      }
    });
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setExtractedData(null);
    setFormData({
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      pH: '',
      organicCarbon: '',
      sulfur: '',
      zinc: '',
      boron: '',
      iron: '',
      manganese: '',
      copper: '',
      availableN: '',
      availableP: '',
      availableK: '',
      requiredN: '',
      requiredP: '',
      requiredK: '',
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Soil Report Analysis</Text>
          <Text style={styles.headerSubtitle}>
            Upload your soil test report or enter data manually
          </Text>
        </View>

        {/* PDF Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Soil Report (PDF)</Text>
          
          {selectedFile ? (
            <View style={styles.fileCard}>
              <View style={styles.fileInfo}>
                <View style={styles.fileIcon}>
                  <Ionicons name="document-text" size={32} color="#F44336" />
                </View>
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                  <Text style={styles.fileSize}>
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </Text>
                  {extractedData && (
                    <View style={styles.successBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                      <Text style={styles.successText}>Data Extracted</Text>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity onPress={removeFile} style={styles.removeButton}>
                <Ionicons name="close-circle" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
              <Ionicons name="cloud-upload-outline" size={48} color={COLORS.primary} />
              <Text style={styles.uploadTitle}>Upload Soil Report</Text>
              <Text style={styles.uploadSubtitle}>Tap to select PDF file</Text>
            </TouchableOpacity>
          )}

          {isProcessing && (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.processingText}>Processing PDF...</Text>
            </View>
          )}
        </View>

        {/* Primary NPK Values */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primary Nutrients (kg/ha)</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nitrogen (N)</Text>
              <TextInput
                style={styles.input}
                value={formData.nitrogen}
                onChangeText={(value) => updateField('nitrogen', value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phosphorus (P)</Text>
              <TextInput
                style={styles.input}
                value={formData.phosphorus}
                onChangeText={(value) => updateField('phosphorus', value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Potassium (K)</Text>
              <TextInput
                style={styles.input}
                value={formData.potassium}
                onChangeText={(value) => updateField('potassium', value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>pH Level</Text>
              <TextInput
                style={styles.input}
                value={formData.pH}
                onChangeText={(value) => updateField('pH', value)}
                placeholder="0.0"
                keyboardType="decimal-pad"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>
          </View>
        </View>

        {/* Secondary Nutrients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Secondary Nutrients (ppm)</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Sulfur (S)</Text>
              <TextInput
                style={styles.input}
                value={formData.sulfur}
                onChangeText={(value) => updateField('sulfur', value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Organic Carbon</Text>
              <TextInput
                style={styles.input}
                value={formData.organicCarbon}
                onChangeText={(value) => updateField('organicCarbon', value)}
                placeholder="0.0"
                keyboardType="decimal-pad"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>
          </View>
        </View>

        {/* Micronutrients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Micronutrients (ppm)</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Zinc (Zn)</Text>
              <TextInput
                style={styles.input}
                value={formData.zinc}
                onChangeText={(value) => updateField('zinc', value)}
                placeholder="0.0"
                keyboardType="decimal-pad"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Boron (B)</Text>
              <TextInput
                style={styles.input}
                value={formData.boron}
                onChangeText={(value) => updateField('boron', value)}
                placeholder="0.0"
                keyboardType="decimal-pad"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Iron (Fe)</Text>
              <TextInput
                style={styles.input}
                value={formData.iron}
                onChangeText={(value) => updateField('iron', value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Manganese (Mn)</Text>
              <TextInput
                style={styles.input}
                value={formData.manganese}
                onChangeText={(value) => updateField('manganese', value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
            </View>
          </View>
        </View>

        {/* Available vs Required */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrient Status</Text>
          
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Available N:</Text>
              <TextInput
                style={styles.statusInput}
                value={formData.availableN}
                onChangeText={(value) => updateField('availableN', value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
              <Text style={styles.statusUnit}>kg/ha</Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Required N:</Text>
              <TextInput
                style={styles.statusInput}
                value={formData.requiredN}
                onChangeText={(value) => updateField('requiredN', value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
              <Text style={styles.statusUnit}>kg/ha</Text>
            </View>
          </View>

          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Available P:</Text>
              <TextInput
                style={styles.statusInput}
                value={formData.availableP}
                onChangeText={(value) => updateField('availableP', value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
              <Text style={styles.statusUnit}>kg/ha</Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Required P:</Text>
              <TextInput
                style={styles.statusInput}
                value={formData.requiredP}
                onChangeText={(value) => updateField('requiredP', value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
              <Text style={styles.statusUnit}>kg/ha</Text>
            </View>
          </View>

          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Available K:</Text>
              <TextInput
                style={styles.statusInput}
                value={formData.availableK}
                onChangeText={(value) => updateField('availableK', value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
              <Text style={styles.statusUnit}>kg/ha</Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Required K:</Text>
              <TextInput
                style={styles.statusInput}
                value={formData.requiredK}
                onChangeText={(value) => updateField('requiredK', value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={COLORS.placeholderText}
              />
              <Text style={styles.statusUnit}>kg/ha</Text>
            </View>
          </View>
        </View>

        {/* Get Suggestions Button */}
        <TouchableOpacity 
          style={styles.suggestButton} 
          onPress={getCropSuggestions}
          activeOpacity={0.8}
        >
          <Ionicons name="bulb-outline" size={20} color="#fff" />
          <Text style={styles.suggestButtonText}>Get Crop Suggestions</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
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
  fileCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  fileInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  fileIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F4433610',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  successText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '600',
  },
  removeButton: {
    marginLeft: 8,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 12,
  },
  processingText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    width: 100,
  },
  statusInput: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusUnit: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  suggestButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  suggestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default NPKUploadPage;
