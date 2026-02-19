import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getColors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
import SafeScreen from '../../components/SafeScreen';

export default function MarketPage() {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Grains', 'Vegetables', 'Fruits', 'Pulses'];

  const marketData = [
    { id: 1, name: 'Wheat', price: '₹2,150', unit: 'per quintal', change: '+2.5%', trend: 'up', category: 'Grains', location: 'Delhi Mandi' },
    { id: 2, name: 'Rice (Basmati)', price: '₹3,200', unit: 'per quintal', change: '+1.8%', trend: 'up', category: 'Grains', location: 'Punjab Mandi' },
    { id: 3, name: 'Tomato', price: '₹45', unit: 'per kg', change: '-3.2%', trend: 'down', category: 'Vegetables', location: 'Nasik Mandi' },
    { id: 4, name: 'Onion', price: '₹38', unit: 'per kg', change: '+5.1%', trend: 'up', category: 'Vegetables', location: 'Nasik Mandi' },
    { id: 5, name: 'Potato', price: '₹22', unit: 'per kg', change: '+0.8%', trend: 'up', category: 'Vegetables', location: 'Agra Mandi' },
    { id: 6, name: 'Apple', price: '₹120', unit: 'per kg', change: '-1.5%', trend: 'down', category: 'Fruits', location: 'Shimla Mandi' },
    { id: 7, name: 'Banana', price: '₹48', unit: 'per dozen', change: '+2.0%', trend: 'up', category: 'Fruits', location: 'Jalgaon Mandi' },
    { id: 8, name: 'Toor Dal', price: '₹145', unit: 'per kg', change: '+3.5%', trend: 'up', category: 'Pulses', location: 'Latur Mandi' },
  ];

  const filteredData = marketData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: COLORS.textPrimary }]}>Local Markets</Text>
            <Text style={[styles.headerSubtitle, { color: COLORS.textTertiary }]}>Daily price updates from mandis</Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={[styles.searchBar, { backgroundColor: COLORS.cardBackground }]}>
            <Ionicons name="search" size={20} color={COLORS.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: COLORS.textPrimary }]}
              placeholder="Search crops or locations..."
              placeholderTextColor={COLORS.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.catChip, { backgroundColor: selectedCategory === cat ? COLORS.primary : COLORS.cardBackground }]}
              >
                <Text style={[styles.catText, { color: selectedCategory === cat ? (isDarkMode ? COLORS.black : COLORS.white) : COLORS.textSecondary }]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {filteredData.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.card, { backgroundColor: COLORS.cardBackground }]} activeOpacity={0.8}>
              <View style={styles.cardLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#1A1A1A' : '#F7F7F7' }]}>
                  <Ionicons name="leaf" size={24} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={[styles.itemName, { color: COLORS.textPrimary }]}>{item.name}</Text>
                  <Text style={[styles.itemSub, { color: COLORS.textTertiary }]}>{item.location}</Text>
                </View>
              </View>
              <View style={styles.cardRight}>
                <Text style={[styles.itemPrice, { color: COLORS.textPrimary }]}>{item.price}</Text>
                <View style={[styles.badge, { backgroundColor: item.trend === 'up' ? `${COLORS.success}15` : `${COLORS.error}15` }]}>
                  <Ionicons name={item.trend === 'up' ? 'trending-up' : 'trending-down'} size={12} color={item.trend === 'up' ? COLORS.success : COLORS.error} />
                  <Text style={[styles.badgeText, { color: item.trend === 'up' ? COLORS.success : COLORS.error }]}>{item.change}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 120 }} />
        </ScrollView>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 10, marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, marginTop: 2, fontWeight: '500' },
  searchRow: { paddingHorizontal: 20, marginBottom: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 56, borderRadius: 20, gap: 10 },
  searchInput: { flex: 1, fontSize: 16, fontWeight: '600' },
  categoryScroll: { paddingHorizontal: 20, paddingBottom: 24, gap: 10 },
  catChip: { paddingHorizontal: 22, paddingVertical: 12, borderRadius: 16 },
  catText: { fontSize: 14, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 20 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 28, marginBottom: 14 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: { width: 52, height: 52, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  itemName: { fontSize: 17, fontWeight: '800' },
  itemSub: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },
  cardRight: { alignItems: 'flex-end' },
  itemPrice: { fontSize: 18, fontWeight: '900' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginTop: 6 },
  badgeText: { fontSize: 11, fontWeight: '800' }
});
