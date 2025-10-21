import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import COLORS from '../../constants/colors';

const NPKAnalysisPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [cropSuggestions, setCropSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve query params or use placeholder if not passed
  const queryParams = {
    N: params.N || '',
    P: params.P || '',
    K: params.K || '',
    temperature: params.temperature || '',
    humidity: params.humidity || '',
    pH: params.pH || '',
    rainfall: params.rainfall || '',
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace this URL with your ML API endpoint
        const response = await fetch('https://your-backend-url.com/api/crop-predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(queryParams),
        });
        if (!response.ok) throw new Error('Prediction failed');
        const data = await response.json();
        setCropSuggestions(data.crops || []);
      } catch (err) {
        setError('Could not load crop predictions');
        setCropSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
    // eslint-disable-next-line
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
            <View style={styles.npkItem}>
              <Text style={styles.npkLabel}>N</Text>
              <Text style={styles.npkValue}>{queryParams.N || '---'}</Text>
            </View>
            <View style={styles.npkItem}>
              <Text style={styles.npkLabel}>P</Text>
              <Text style={styles.npkValue}>{queryParams.P || '---'}</Text>
            </View>
            <View style={styles.npkItem}>
              <Text style={styles.npkLabel}>K</Text>
              <Text style={styles.npkValue}>{queryParams.K || '---'}</Text>
            </View>
            <View style={styles.npkItem}>
              <Text style={styles.npkLabel}>pH</Text>
              <Text style={styles.npkValue}>{queryParams.pH || '---'}</Text>
            </View>
          </View>
        </View>

        {/* Crop Suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Crops ({cropSuggestions.length})</Text>
          <Text style={styles.sectionSubtitle}>
            Sorted by suitability score based on your soil nutrients
          </Text>

          {loading && (
            <View style={{ marginVertical: 18, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={{ color: COLORS.textSecondary, marginTop: 8 }}>Loading crop recommendations...</Text>
            </View>
          )}

          {error && <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>}

          {!loading && !error && cropSuggestions.map((crop) => (
            <View key={crop.id} style={styles.cropCard}>
              {/* Header */}
              <View style={styles.cropHeader}>
                <View style={styles.cropTitleContainer}>
                  <View style={[styles.cropIcon, { backgroundColor: `${crop.color || COLORS.primary}15` }]}>
                    <Ionicons name={crop.icon || 'leaf'} size={24} color={crop.color || COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.cropName}>{crop.name}</Text>
                    <Text style={styles.cropSeason}>{crop.season} • {crop.duration}</Text>
                  </View>
                </View>
                <View style={styles.suitabilityBadge}>
                  <Text style={styles.suitabilityText}>{crop.suitability}%</Text>
                  <Text style={styles.suitabilityLabel}>Match</Text>
                </View>
              </View>

              {/* Financial Details */}
              <View style={styles.financialGrid}>
                <View style={styles.financialItem}>
                  <Ionicons name="trending-up" size={18} color="#4CAF50" />
                  <Text style={styles.financialLabel}>Market Price</Text>
                  <Text style={styles.financialValue}>{crop.marketPrice}</Text>
                  <Text style={styles.financialUnit}>{crop.priceUnit}</Text>
                </View>
                <View style={styles.financialItem}>
                  <Ionicons name="stats-chart" size={18} color="#2196F3" />
                  <Text style={styles.financialLabel}>Yield</Text>
                  <Text style={styles.financialValue}>{crop.yield}</Text>
                  <Text style={styles.financialUnit}>{crop.yieldUnit}</Text>
                </View>
                <View style={styles.financialItem}>
                  <Ionicons name="cash" size={18} color="#FF9800" />
                  <Text style={styles.financialLabel}>Investment</Text>
                  <Text style={styles.financialValue}>{crop.investment}</Text>
                  <Text style={styles.financialUnit}>{crop.investmentUnit}</Text>
                </View>
                <View style={styles.financialItem}>
                  <Ionicons name="wallet" size={18} color="#9C27B0" />
                  <Text style={styles.financialLabel}>Expected Returns</Text>
                  <Text style={styles.financialValue}>{crop.returns}</Text>
                  <Text style={styles.financialUnit}>{crop.returnsUnit}</Text>
                </View>
              </View>

              {/* Profit Analysis */}
              <View style={styles.profitContainer}>
                <View style={styles.profitRow}>
                  <Text style={styles.profitLabel}>Net Profit:</Text>
                  <Text style={styles.profitValue}>{crop.profit}</Text>
                </View>
                <View style={styles.profitRow}>
                  <Text style={styles.profitLabel}>Profit Margin:</Text>
                  <Text style={[styles.profitValue, { color: '#4CAF50' }]}>{crop.profitMargin}</Text>
                </View>
              </View>

              {/* Water Requirement */}
              <View style={styles.waterBadge}>
                <Ionicons name="water" size={16} color="#2196F3" />
                <Text style={styles.waterText}>Water: {crop.waterRequirement}</Text>
              </View>

              {/* Reasons */}
              <View style={styles.reasonsContainer}>
                <Text style={styles.reasonsTitle}>Why this crop?</Text>
                {crop.reasons && crop.reasons.map((reason, index) => (
                  <View key={index} style={styles.reasonItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.reasonText}>{reason}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Additional Information */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={COLORS.primary} />
          <Text style={styles.infoText}>
            These recommendations are based on your soil's NPK, pH, and weather factors.
            Market prices and yields may vary based on location and season.
          </Text>
        </View>

        {/* Back to Home Button */}
        <TouchableOpacity 
          style={styles.homeButton} 
          onPress={() => router.push('/(tabs)')}
          activeOpacity={0.8}
        >
          <Ionicons name="home" size={20} color="#fff" />
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 48,
    backgroundColor: COLORS.cardBackground,
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  soilSummary: {
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  npkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  npkItem: {
    alignItems: 'center',
  },
  npkLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  npkValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  cropCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cropTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cropIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cropName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cropSeason: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  suitabilityBadge: {
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  suitabilityText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  suitabilityLabel: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 2,
  },
  financialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  financialItem: {
    width: '48%',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  financialLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 6,
    marginBottom: 4,
  },
  financialValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  financialUnit: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  profitContainer: {
    backgroundColor: `${COLORS.primary}08`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  profitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  profitLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  profitValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  waterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F310',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  waterText: {
    fontSize: 13,
    color: '#2196F3',
    marginLeft: 6,
    fontWeight: '600',
  },
  reasonsContainer: {
    marginTop: 8,
  },
  reasonsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  reasonText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.primary}10`,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    marginLeft: 12,
    lineHeight: 20,
  },
  homeButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default NPKAnalysisPage;
