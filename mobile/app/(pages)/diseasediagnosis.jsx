import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import COLORS from '../../constants/colors';
import { FLASK_API_URL } from '../../constants/flaskapi';
import styles from '../../assets/styles/diseasediagnosis.styles';

const DiagnosisPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const diagnosisType = params.diagnosisType;
  const isDiseaseDiagnosis = diagnosisType === 'disease';

  const diseaseInput = params.diseaseInput ? JSON.parse(params.diseaseInput) : null;
  const issues = JSON.parse(params.issues || '[]');

  const [symptoms, setSymptoms] = useState([]);
  const [remedies, setRemedies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDiseaseDiagnosis && diseaseInput) {
      setLoading(true);

      fetch(`${FLASK_API_URL}/predict_disease`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diseaseInput),
      })
        .then(response => response.json())
        .then(data => {
          if (data.predicted_disease) {
            setSymptoms(data.symptoms || []);

            if (data.remedies) {
              const remediesArr = data.remedies
                .split(/;|\n/)
                .map(item => item.trim())
                .filter(item => item.length > 0);
              setRemedies(remediesArr);
            } else {
              setRemedies(['No remedies information available']);
            }
          } else {
            setSymptoms([]);
            setRemedies(['No prediction available']);
          }
        })
        .catch(error => {
          Alert.alert('Error', 'Failed to fetch disease information.');
          setSymptoms([]);
          setRemedies([]);
        })
        .finally(() => setLoading(false));
    }
  }, [diseaseInput, isDiseaseDiagnosis]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disease Diagnosis</Text>
      </View>

      {/* Symptoms Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detected Symptoms</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : symptoms.length > 0 ? (
          symptoms.map((symptom, index) => (
            <Text key={index} style={styles.symptomText}>
              • {symptom}
            </Text>
          ))
        ) : (
          <Text>No symptoms information available.</Text>
        )}
      </View>

      {/* Remedies Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Remedies</Text>
        {loading ? (
          <Text>Loading remedies...</Text>
        ) : remedies.length > 0 ? (
          remedies.map((remedy, index) => (
            <Text key={index} style={styles.treatmentText}>
              • {remedy}
            </Text>
          ))
        ) : (
          <Text>No remedies available.</Text>
        )}
      </View>

      {/* Issues Detected Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Issues Detected</Text>
        {issues.length > 0 ? (
          issues.map((issue, index) => (
            <View key={index} style={styles.issueCard}>
              <Ionicons name="alert-circle" size={20} color="#F44336" />
              <Text style={styles.issueText}>{issue}</Text>
            </View>
          ))
        ) : (
          <Text>No issues detected.</Text>
        )}
      </View>

      {/* Additional Tips Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Tips</Text>
        <View style={styles.tipsCard}>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.tipText}>Monitor plant daily for changes</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.tipText}>Ensure proper drainage in soil</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.tipText}>Remove affected leaves if necessary</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DiagnosisPage;
