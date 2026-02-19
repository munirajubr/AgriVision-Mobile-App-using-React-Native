import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getColors } from '../constants/colors';
import { useThemeStore } from '../store/themeStore';

const Card = ({ image, icon, title, subtitle, link, onPress, variant = 'horizontal', bgColor, themeColor, rating, badge, actionLabel, iconColor }) => {
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

  const cardBg = bgColor || COLORS.cardBackground;
  const accentColor = themeColor || COLORS.primary;

  // Modern Box Card (for grid layout)
  if (variant === 'box') {
    return (
      <TouchableOpacity
        style={[styles.boxCard, { backgroundColor: cardBg, borderWidth: 0 }]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={[styles.boxIconContainer, { backgroundColor: `${accentColor}15` }]}>
          <Ionicons name={icon} size={24} color={accentColor} />
        </View>
        <View style={styles.boxTextContainer}>
          <Text style={[styles.boxSubtitle, { color: COLORS.textSecondary }]}>{subtitle}</Text>
          <Text style={[styles.boxTitle, { color: COLORS.textPrimary }]} numberOfLines={2}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Large Featured Card
  if (variant === 'large') {
    return (
      <TouchableOpacity
        style={[styles.largeCard, { backgroundColor: cardBg, borderWidth: 0 }]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.largeContent}>
          <View style={styles.largeTextContainer}>
            <Text style={[styles.largeTitle, { color: COLORS.textPrimary }]}>{title}</Text>
            {subtitle && <Text style={[styles.largeSubtitle, { color: COLORS.textSecondary }]}>{subtitle}</Text>}
            <TouchableOpacity 
              style={[styles.largeActionBtn, { backgroundColor: COLORS.primary }]}
              onPress={handlePress}
            >
              <Text style={{ color: isDarkMode ? COLORS.black : COLORS.white, fontWeight: '700', fontSize: 12 }}>{actionLabel || 'Explore'}</Text>
            </TouchableOpacity>
          </View>
          {icon ? (
            <View style={styles.largeIconContainer}>
              <Ionicons name={icon} size={80} color={iconColor || COLORS.primary} opacity={0.8} />
            </View>
          ) : image && (
            <Image
              source={image}
              style={styles.largeImage}
              resizeMode="contain"
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // Horizontal Card (standard list item)
  return (
    <TouchableOpacity 
      style={[styles.horizontalCard, { backgroundColor: cardBg, borderWidth: 0 }]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.horizontalTextContent}>
        <Text style={[styles.horizontalTitle, { color: COLORS.textPrimary }]}>{title}</Text>
        <View style={styles.metaRow}>
          {rating && (
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
          )}
          {subtitle && (
            <Text style={[styles.horizontalSubtitle, { color: COLORS.textTertiary }]}>
              {rating ? ' • ' : ''}{subtitle}
            </Text>
          )}
        </View>
      </View>
      {badge && (
        <View style={[styles.badgeContainer, { backgroundColor: `${COLORS.success}15` }]}>
          <Text style={[styles.badgeText, { color: COLORS.success }]}>{badge}</Text>
        </View>
      )}
      {!badge && <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Box Card Styles
  boxCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 160,
  },
  boxIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  boxTextContainer: {
    width: '100%',
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  boxSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Large Card Styles
  largeCard: {
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 24,
  },
  largeImage: {
    width: '40%',
    height: 120,
  },
  largeContent: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  largeTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  largeTitle: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  largeSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
    lineHeight: 18,
    opacity: 0.7,
  },
  largeActionBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignSelf: 'flex-start',
  },
  largeIconContainer: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Horizontal Card Styles
  horizontalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
  },
  horizontalTextContent: {
    flex: 1,
  },
  horizontalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  horizontalSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
    opacity: 0.6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default Card;
