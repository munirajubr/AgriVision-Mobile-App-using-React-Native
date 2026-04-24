import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getColors } from '../constants/colors';
import { useThemeStore } from '../store/themeStore';

export default function CompleteProfileBanner({ onDismiss, visible = true }) {
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  const router = useRouter();

  const slideAnim = useRef(new Animated.Value(-120)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -120, duration: 250, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: -120, duration: 300, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  const handlePress = () => {
    router.push('/(pages)/editprofile');
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, {
      backgroundColor: isDarkMode ? '#1A2E1A' : '#E8F5E9',
      borderColor: isDarkMode ? '#2E7D32' : '#A5D6A7',
      transform: [{ translateY: slideAnim }],
      opacity: fadeAnim,
    }]}>
      <TouchableOpacity style={styles.content} onPress={handlePress} activeOpacity={0.8}>
        <View style={[styles.iconCircle, { backgroundColor: COLORS.primary }]}>
          <Ionicons name="person-outline" size={18} color="#FFF" />
        </View>
        <View style={styles.textContent}>
          <Text style={[styles.title, { color: COLORS.textPrimary }]}>Complete Your Profile</Text>
          <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
            Add farm details for personalized insights
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeBtn} onPress={handleDismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="close" size={18} color={COLORS.textTertiary} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingRight: 40,
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
