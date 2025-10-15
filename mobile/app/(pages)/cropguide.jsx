import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Papa from "papaparse";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { cropCsv } from "../../dataset/cropData";
import styles from "../../assets/styles/crop.styles";

const categories = ["All", "Grains", "Vegetables", "Fruits", "Cash Crops"];

const CropGuideScreen = () => {
  const [cropList, setCropList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const results = Papa.parse(cropCsv, {
      header: true,
      skipEmptyLines: true,
    });
    setCropList(results.data);
  }, []);

  const filteredCrops = cropList.filter((crop) => {
    const matchesSearch = crop.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={COLORS.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search crops..."
          placeholderTextColor={COLORS.placeholderText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
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
                selectedCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Crop List */}
      <ScrollView
        style={styles.cropList}
        contentContainerStyle={styles.cropListContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredCrops.length > 0 ? (
          filteredCrops.map((crop, index) => (
            <TouchableOpacity key={index} style={styles.cropCard} activeOpacity={0.7}>
              <View style={styles.cropCardHeader}>
                <View style={styles.cropInfo}>
                  <Text style={styles.cropName}>{crop.name}</Text>
                  <Text style={styles.cropCategory}>{crop.category}</Text>
                </View>
                <View style={styles.cropStats}>
                  <Text style={styles.cropYield}>{crop.yield} quintals/acre</Text>
                </View>
              </View>

              <View style={styles.cropCardBody}>
                <Text style={styles.detailText}>🌱 Season: {crop.season}</Text>
                <Text style={styles.detailText}>💰 Avg Price: {crop.price}</Text>
              </View>

              <Text
                style={styles.descriptionText}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {crop.description || "No description available."}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyText}>No crops found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CropGuideScreen;
