import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useToastStore } from '../store/toastStore';
import { getColors } from '../constants/colors';
import { useThemeStore } from '../store/themeStore';

const { width } = Dimensions.get('window');

export default function Toast() {
  const { visible, message, type, hideToast } = useToastStore();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 50, tension: 50, friction: 8, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -100, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible && opacity._value === 0) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'alert-circle';
      case 'info': return 'information-circle';
      default: return 'notifications';
    }
  };

  const getBackgroundColor = () => {
    if (type === 'success') return isDarkMode ? '#1B4D1E' : '#E8F5E9';
    if (type === 'error') return isDarkMode ? '#4D1B1B' : '#FEEBEB';
    return isDarkMode ? '#1B2E4D' : '#EBF1FE';
  };

  const getBorderColor = () => {
    if (type === 'success') return COLORS.success;
    if (type === 'error') return COLORS.error;
    return COLORS.info;
  };

  const getTextColor = () => {
    if (type === 'success') return isDarkMode ? '#81C784' : '#2E7D32';
    if (type === 'error') return isDarkMode ? '#E57373' : '#D32F2F';
    return isDarkMode ? '#64B5F6' : '#1976D2';
  };

  return (
    <Animated.View style={[
      styles.container,
      {
        opacity,
        transform: [{ translateY }],
        backgroundColor: getBackgroundColor(),
        borderColor: getBorderColor(),
      }
    ]}>
      <Ionicons name={getIcon()} size={24} color={getBorderColor()} />
      <Text style={[styles.message, { color: getTextColor() }]} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
      android: { elevation: 8 },
    }),
  },
  message: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 12,
    flex: 1,
  },
});
