import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getColors } from '../constants/colors';
import { useThemeStore } from '../store/themeStore';

const Card = ({ image, icon, title, subtitle, link, onPress, variant = 'horizontal' }) => {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (link) {
      router.push(link);
    }
  };

  // Modern Box Card (for grid layout)
  if (variant === 'box') {
    return (
      <TouchableOpacity
        style={[styles.boxCard, { backgroundColor: COLORS.cardBackground }]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={[styles.boxIconContainer, { backgroundColor: `${COLORS.primary}10` }]}>
          <Ionicons name={icon} size={24} color={COLORS.primary} />
        </View>
        <Text style={[styles.boxTitle, { color: COLORS.textPrimary }]} numberOfLines={1}>{title}</Text>
        {subtitle && <Text style={[styles.boxSubtitle, { color: COLORS.textTertiary }]} numberOfLines={1}>{subtitle}</Text>}
      </TouchableOpacity>
    );
  }

  // Large Featured Card
  if (variant === 'large') {
    return (
      <TouchableOpacity
        style={[styles.largeCard, { backgroundColor: COLORS.cardBackground }]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        {image && (
          <Image
            source={image}
            style={styles.largeImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.largeContent}>
          <View style={styles.largeTextContainer}>
            <Text style={[styles.largeTitle, { color: COLORS.textPrimary }]}>{title}</Text>
            {subtitle && <Text style={[styles.largeSubtitle, { color: COLORS.textSecondary }]}>{subtitle}</Text>}
          </View>
          <View style={[styles.largeActionBtn, { backgroundColor: COLORS.primary }]}>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Horizontal Card (standard list item)
  return (
    <TouchableOpacity 
      style={[styles.horizontalCard, { backgroundColor: COLORS.cardBackground }]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[styles.horizontalIconContainer, { backgroundColor: `${COLORS.primary}10` }]}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={COLORS.primary} 
        />
      </View>
      <View style={styles.horizontalTextContent}>
        <Text style={[styles.horizontalTitle, { color: COLORS.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[styles.horizontalSubtitle, { color: COLORS.textTertiary }]}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Box Card Styles
  boxCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  boxIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  boxTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  boxSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 2,
  },

  // Large Card Styles
  largeCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  largeImage: {
    width: '100%',
    height: 200,
  },
  largeContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  largeTextContainer: {
    flex: 1,
  },
  largeTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  largeSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 4,
  },
  largeActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Horizontal Card Styles
  horizontalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  horizontalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  horizontalTextContent: {
    flex: 1,
  },
  horizontalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  horizontalSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
  },
});

export default Card;
