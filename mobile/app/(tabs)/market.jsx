import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import styles from '../../assets/styles/market.styles';

const API_KEY = process.env.MARKET_API_KEY;

const API_URL = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json`;

const MarketScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [marketPrices, setMarketPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define categories roughly based on commodity groups
  const categories = ['All', 'Grains', 'Vegetables', 'Fruits', 'Cash Crops', 'Other'];

  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();

        // Map API records to your UI model
        const formattedData = (data.records || []).map((item, index) => {
          // Basic categorization example - expand or refine as needed
          const grains = ['Rice', 'Wheat', 'Bajra(Pearl Millet/Cumbu)'];
          const vegetables = ['Tomato', 'Potato', 'Onion'];
          const cashCrops = ['Cotton', 'Sunflower'];
          let category = 'Other';
          if (grains.includes(item.commodity)) category = 'Grains';
          else if (vegetables.includes(item.commodity)) category = 'Vegetables';
          else if (cashCrops.includes(item.commodity)) category = 'Cash Crops';

          return {
            id: index,
            name: item.commodity,
            category,
            price: `₹${item.modal_price}`,
            unit: 'per quintal',
            // No percent change info in API, set neutral values or remove UI if preferred
            change: '',
            isUp: true,
            location: item.market,
            lastUpdated: item.arrival_date,
          };
        });

        setMarketPrices(formattedData);
      } catch (err) {
        setError(err.message || 'Failed to load market data');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  const filteredCrops = marketPrices.filter((crop) => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Market Prices</Text>
        <Text style={styles.headerSubtitle}>Live crop prices from mandis across India</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search crops..."
          placeholderTextColor={COLORS.placeholderText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoryWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContent}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.priceList} contentContainerStyle={styles.priceListContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : error ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyText}>{error}</Text>
          </View>
        ) : filteredCrops.length > 0 ? (
          filteredCrops.map((crop) => (
            <TouchableOpacity key={crop.id} style={styles.priceCard} activeOpacity={0.7}>
              <View style={styles.priceCardHeader}>
                <View style={styles.cropInfo}>
                  <Text style={styles.cropName}>{crop.name}</Text>
                  <Text style={styles.cropCategory}>{crop.category}</Text>
                </View>
                <View style={styles.priceInfo}>
                  <Text style={styles.price}>{crop.price}</Text>
                  <Text style={styles.unit}>{crop.unit}</Text>
                </View>
              </View>

              <View style={styles.priceCardBody}>
                <Text style={styles.location}>{crop.location}</Text>
                <Text style={styles.lastUpdated}>Updated {crop.lastUpdated}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyText}>No crops found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MarketScreen;
