import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Smart Crop\nDiagnosis',
    description: 'Instantly identify plant diseases with AI and get expert recommendations for sustainable farming.',
    icon: 'scan-outline',
    gradient: ['#0D4F1C', '#1B7A2D', '#28A745'],
    accentIcon: 'leaf',
    particles: ['🌿', '🍃', '🌱'],
  },
  {
    id: '2',
    title: 'Precision Farm\nMonitoring',
    description: 'Track soil moisture, temperature and climate conditions from anywhere — in real time.',
    icon: 'stats-chart-outline',
    gradient: ['#0A3D5C', '#1565C0', '#1E88E5'],
    accentIcon: 'analytics',
    particles: ['📊', '🌡️', '💧'],
  },
  {
    id: '3',
    title: 'Market\nInsights',
    description: 'Access live mandi prices and discover the best selling opportunities for your harvest.',
    icon: 'trending-up-outline',
    gradient: ['#4A1A6B', '#7B1FA2', '#AB47BC'],
    accentIcon: 'cash',
    particles: ['📈', '💰', '🌾'],
  },
];

const Onboarding = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Content fade / slide animations
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;
  const iconScale = useRef(new Animated.Value(0.3)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;

  // Background gradient transition
  const bgFade = useRef(new Animated.Value(1)).current;

  // Floating particle animations (looping)
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;

  // Button pulse
  const buttonPulse = useRef(new Animated.Value(1)).current;

  // Start looping animations once
  useEffect(() => {
    const createFloat = (anim, duration) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration, useNativeDriver: true }),
        ])
      ).start();
    };
    createFloat(float1, 3000);
    createFloat(float2, 2500);
    createFloat(float3, 3500);

    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, { toValue: 1.06, duration: 1200, useNativeDriver: true }),
        Animated.timing(buttonPulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Animate content in
  const animateIn = useCallback(() => {
    contentFade.setValue(0);
    contentSlide.setValue(30);
    iconScale.setValue(0.3);
    iconRotate.setValue(0);

    Animated.parallel([
      Animated.timing(contentFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(contentSlide, { toValue: 0, tension: 60, friction: 9, useNativeDriver: true }),
      Animated.spring(iconScale, { toValue: 1, tension: 70, friction: 5, useNativeDriver: true }),
      Animated.timing(iconRotate, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  // Animate content out, then switch, then animate in
  const transitionTo = useCallback((nextIndex) => {
    // Fade out current content
    Animated.parallel([
      Animated.timing(contentFade, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: -20, duration: 200, useNativeDriver: true }),
      Animated.timing(iconScale, { toValue: 0.6, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setCurrentIndex(nextIndex);
      animateIn();
    });
  }, [animateIn]);

  // Initial entrance
  useEffect(() => {
    animateIn();
  }, []);

  const scrollToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      transitionTo(currentIndex + 1);
    } else {
      router.replace('/signup');
    }
  };

  const item = SLIDES[currentIndex];

  const spinIcon = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background — render all gradients, only active one is visible */}
      {SLIDES.map((slide, i) => (
        <Animated.View
          key={slide.id}
          style={[StyleSheet.absoluteFill, {
            opacity: i === currentIndex ? 1 : 0,
            zIndex: i === currentIndex ? 1 : 0,
          }]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={slide.gradient}
            style={styles.gradientBg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
      ))}

      {/* Top Hero Area */}
      <View style={styles.topSection}>
        {/* Decorative circles */}
        <View style={styles.decorContainer}>
          <View style={[styles.decorCircle, { width: 300, height: 300, top: -80, right: -80, opacity: 0.06 }]} />
          <View style={[styles.decorCircle, { width: 200, height: 200, bottom: 40, left: -60, opacity: 0.05 }]} />
          <View style={[styles.decorCircle, { width: 150, height: 150, top: 100, left: 60, opacity: 0.04 }]} />
        </View>

        {/* Floating particles */}
        <Animated.Text style={[styles.particle, {
          top: '15%', left: '10%',
          transform: [{ translateY: float1.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) }],
          opacity: float1.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.4, 0.8, 0.4] }),
        }]}>{item.particles[0]}</Animated.Text>

        <Animated.Text style={[styles.particle, {
          top: '25%', right: '12%', fontSize: 28,
          transform: [{ translateY: float2.interpolate({ inputRange: [0, 1], outputRange: [0, -15] }) }],
          opacity: float2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3, 0.7, 0.3] }),
        }]}>{item.particles[1]}</Animated.Text>

        <Animated.Text style={[styles.particle, {
          bottom: '20%', left: '20%', fontSize: 22,
          transform: [{ translateY: float3.interpolate({ inputRange: [0, 1], outputRange: [0, -18] }) }],
          opacity: float3.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3, 0.6, 0.3] }),
        }]}>{item.particles[2]}</Animated.Text>

        {/* Central Icon — fades in with scale + rotation */}
        <Animated.View style={[styles.iconWrapper, {
          opacity: contentFade,
          transform: [
            { scale: iconScale },
            { rotate: spinIcon },
          ],
        }]}>
          <View style={styles.iconGlow}>
            <Ionicons name={item.icon} size={100} color="rgba(255,255,255,0.95)" />
          </View>
        </Animated.View>

        {/* Mini floating badge */}
        <Animated.View style={[styles.floatingBadge, {
          opacity: contentFade,
          transform: [{ translateY: float1.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }],
        }]}>
          <Ionicons name={item.accentIcon} size={16} color="#FFF" />
          <Text style={styles.badgeText}>AgriVision AI</Text>
        </Animated.View>
      </View>

      {/* Bottom Content Card */}
      <View style={styles.bottomSection}>
        {/* Text content — fades in with slide */}
        <Animated.View style={[styles.textContainer, {
          opacity: contentFade,
          transform: [{ translateY: contentSlide }],
        }]}>
          <Text style={styles.slideTitle}>{item.title}</Text>
          <Text style={styles.slideDescription}>{item.description}</Text>
        </Animated.View>

        {/* Navigation Footer */}
        <View style={styles.navFooter}>
          {/* Dots — static, no animation needed */}
          <View style={styles.dotsContainer}>
            {SLIDES.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => { if (i !== currentIndex) transitionTo(i); }}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.dot,
                  {
                    backgroundColor: item.gradient[1],
                    width: i === currentIndex ? 28 : 8,
                    opacity: i === currentIndex ? 1 : 0.3,
                  },
                ]} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Nav Buttons */}
          <View style={styles.navButtons}>
            {currentIndex > 0 ? (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => transitionTo(currentIndex - 1)}
                activeOpacity={0.6}
              >
                <Ionicons name="arrow-back" size={22} color="#AAAAAA" />
              </TouchableOpacity>
            ) : (
              <View style={styles.backButtonPlaceholder} />
            )}

            {/* Next Button */}
            <Animated.View style={{ transform: [{ scale: buttonPulse }] }}>
              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: item.gradient[1] }]}
                onPress={scrollToNext}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={currentIndex === SLIDES.length - 1 ? "rocket-outline" : "arrow-forward"}
                  size={26}
                  color="#FFF"
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Skip / Login Link */}
        <View style={styles.bottomLinks}>
          {currentIndex < SLIDES.length - 1 && (
            <TouchableOpacity onPress={() => router.replace('/signup')}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
          {currentIndex === SLIDES.length - 1 && (
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={[styles.loginHighlight, { color: item.gradient[1] }]}>Login</Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradientBg: {
    flex: 1,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2,
  },
  decorContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#FFF',
  },
  particle: {
    position: 'absolute',
    fontSize: 32,
    zIndex: 5,
  },
  iconWrapper: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingBadge: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomSection: {
    height: height * 0.40,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 30,
    paddingTop: 36,
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    zIndex: 3,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  slideTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111',
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 14,
  },
  slideDescription: {
    fontSize: 16,
    color: '#777',
    lineHeight: 24,
    fontWeight: '500',
  },
  navFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  navButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonPlaceholder: {
    width: 44,
    height: 44,
  },
  bottomLinks: {
    alignItems: 'center',
    minHeight: 30,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
  },
  loginText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#888',
  },
  loginHighlight: {
    fontWeight: '800',
  },
});

export default Onboarding;
