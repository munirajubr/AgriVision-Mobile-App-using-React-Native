import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const DRONE_BG_IMAGE = 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1200&auto=format&fit=crop';

const SLIDES = [
  {
    id: '1',
    badge: 'Smart Farming',
    title: 'Welcome to\nAgriVision',
    description: 'AI-powered tools for smarter, higher-yield farming and precision crop care.',
    cta: 'Get Started',
  },
  {
    id: '2',
    badge: 'AI Diagnosis',
    title: 'Instant Crop\nHealth Detection',
    description: 'Detect pests, fungal diseases, and nutrient shortages in seconds with computer vision.',
    cta: 'Continue',
  },
  {
    id: '3',
    badge: 'IoT Precision',
    title: 'Real-Time Soil &\nWeather Analytics',
    description: 'Monitor moisture, pH, and micro-climate conditions with smart IoT sensor probes.',
    cta: 'Enter Farm Hub',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Smooth entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;

  const animateIn = useCallback(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(24);

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 70, friction: 9, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    animateIn();

    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, { toValue: 1.03, duration: 1400, useNativeDriver: true }),
        Animated.timing(buttonPulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, [animateIn, buttonPulse]);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
        setCurrentIndex(currentIndex + 1);
        animateIn();
      });
    } else {
      router.replace('/signup');
    }
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Full-bleed Lush Drone Agriculture Field Background */}
      <ImageBackground
        source={{ uri: DRONE_BG_IMAGE }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            'rgba(8, 20, 10, 0.35)',
            'rgba(10, 24, 12, 0.2)',
            'rgba(6, 16, 8, 0.85)',
            'rgba(4, 12, 6, 0.96)',
          ]}
          locations={[0, 0.35, 0.72, 1]}
          style={styles.gradientOverlay}
        >
          {/* Top Brand Pill Header */}
          <View style={styles.topHeader}>
            <View style={styles.brandPill}>
              <Ionicons name="leaf" size={14} color="#A3E635" />
              <Text style={styles.brandPillText}>AGRIVISION AI</Text>
            </View>

            {currentIndex < SLIDES.length - 1 && (
              <TouchableOpacity 
                style={styles.skipBtn}
                onPress={() => router.replace('/signup')}
                activeOpacity={0.7}
              >
                <Text style={styles.skipBtnText}>Skip</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Central Visual / Drone focal region */}
          <View style={styles.focalCenterRegion}>
            {currentIndex > 0 && (
              <Animated.View style={[styles.stepIndicatorBadge, { opacity: fadeAnim }]}>
                <Text style={styles.stepIndicatorText}>{currentSlide.badge}</Text>
              </Animated.View>
            )}
          </View>

          {/* Bottom Card Area (Matching Image 1 Screen 1) */}
          <Animated.View 
            style={[
              styles.bottomContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {/* Title with clean bold typography */}
            <Text style={styles.heroTitle}>{currentSlide.title}</Text>

            {/* Subtitle */}
            <Text style={styles.heroSubtitle}>{currentSlide.description}</Text>

            {/* Slide Dots */}
            <View style={styles.dotsRow}>
              {SLIDES.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dotItem,
                    i === currentIndex ? styles.dotItemActive : styles.dotItemInactive,
                  ]}
                />
              ))}
            </View>

            {/* Vibrant Lime Green Pill Button */}
            <Animated.View style={{ transform: [{ scale: buttonPulse }] }}>
              <TouchableOpacity
                style={styles.limePillButton}
                onPress={handleNext}
                activeOpacity={0.85}
              >
                <Text style={styles.limePillButtonText}>{currentSlide.cta}</Text>
                <Ionicons name="arrow-forward" size={18} color="#0D2E14" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </Animated.View>

            {/* Sign in fallback */}
            <View style={styles.loginRow}>
              <Text style={styles.loginQuestion}>Already have a farm account? </Text>
              <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text style={styles.loginLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07160B',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 54,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },

  // Top Header
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  brandPillText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
    marginLeft: 6,
  },
  skipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  skipBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  // Focal Center Region
  focalCenterRegion: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIndicatorBadge: {
    backgroundColor: 'rgba(163, 230, 53, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A3E635',
  },
  stepIndicatorText: {
    color: '#A3E635',
    fontWeight: '700',
    fontSize: 13,
  },

  // Bottom Content Area
  bottomContent: {
    width: '100%',
    paddingBottom: 8,
  },
  heroTitle: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    marginBottom: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 26,
  },
  dotItem: {
    height: 6,
    borderRadius: 3,
  },
  dotItemActive: {
    width: 24,
    backgroundColor: '#A3E635',
  },
  dotItemInactive: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Lime Pill Button
  limePillButton: {
    backgroundColor: '#C8F572',
    height: 58,
    borderRadius: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C8F572',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 18,
  },
  limePillButtonText: {
    color: '#0D2E14',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // Login Row
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  loginQuestion: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
  },
  loginLink: {
    color: '#A3E635',
    fontWeight: '700',
    fontSize: 13,
  },
});
