import { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import styles from '../../assets/styles/market.styles';

const MarketScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sample market data
  const marketPrices = [
    {
      id: 1,
      name: 'Rice',
      category: 'Grains',
      price: '₹2,850',
      unit: 'per quintal',
      change: '+5.2%',
      isUp: true,
      location: 'Mandya Market',
      lastUpdated: '2 hours ago',
    },
    {
      id: 2,
      name: 'Wheat',
      category: 'Grains',
      price: '₹2,150',
      unit: 'per quintal',
      change: '-2.1%',
      isUp: false,
      location: 'Delhi Market',
      lastUpdated: '1 hour ago',
    },
    {
      id: 3,
      name: 'Tomato',
      category: 'Vegetables',
      price: '₹45',
      unit: 'per kg',
      change: '+12.5%',
      isUp: true,
      location: 'Bangalore Market',
      lastUpdated: '30 mins ago',
    },
    {
      id: 4,
      name: 'Onion',
      category: 'Vegetables',
      price: '₹32',
      unit: 'per kg',
      change: '-8.3%',
      isUp: false,
      location: 'Pune Market',
      lastUpdated: '45 mins ago',
    },
    {
      id: 5,
      name: 'Cotton',
      category: 'Cash Crops',
      price: '₹7,500',
      unit: 'per quintal',
      change: '+3.7%',
      isUp: true,
      location: 'Guntur Market',
      lastUpdated: '3 hours ago',
    },
    {
      id: 6,
      name: 'Sugarcane',
      category: 'Cash Crops',
      price: '₹310',
      unit: 'per quintal',
      change: '+1.2%',
      isUp: true,
      location: 'Lucknow Market',
      lastUpdated: '4 hours ago',
    },
  ];

  const categories = ['All', 'Grains', 'Vegetables', 'Fruits', 'Cash Crops'];

  // Filter crops based on search and category
  const filteredCrops = marketPrices.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Market Prices</Text>
        <Text style={styles.headerSubtitle}>Live crop prices from mandis across India</Text>
      </View>

      {/* Search Bar */}
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

      {/* Category Filter - Fixed height */}
      <View style={styles.categoryWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Market Price List */}
      <ScrollView 
        style={styles.priceList}
        contentContainerStyle={styles.priceListContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredCrops.length > 0 ? (
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
                <View style={styles.changeContainer}>
                  <Ionicons 
                    name={crop.isUp ? 'trending-up' : 'trending-down'} 
                    size={16} 
                    color={crop.isUp ? '#4CAF50' : '#F44336'} 
                  />
                  <Text style={[
                    styles.changeText,
                    { color: crop.isUp ? '#4CAF50' : '#F44336' }
                  ]}>
                    {crop.change}
                  </Text>
                </View>
                <Text style={styles.divider}>•</Text>
                <Text style={styles.location}>{crop.location}</Text>
              </View>

              <Text style={styles.lastUpdated}>Updated {crop.lastUpdated}</Text>
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
