import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getColors } from '../constants/colors';
import { useThemeStore } from '../store/themeStore';
import SafeScreen from '../components/SafeScreen';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Instant Crop Care',
    description: 'Use your camera to find plant diseases and get the right medicine for your crops.',
    icon: 'scan-outline',
  },
  {
    id: '2',
    title: 'Soil & Farm Monitor',
    description: 'Watch your farm moisture and temperature anywhere, anytime from your phone.',
    icon: 'stats-chart-outline',
  },
  {
    id: '3',
    title: 'Better Market Prices',
    description: 'Check daily mandi rates and follow our guides to get the best harvest.',
    icon: 'leaf-outline',
  },
];

const Onboarding = () => {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  const COLORS = getColors(isDarkMode);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < SLIDES.length - 1) {
        slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
      } else {
        slidesRef.current?.scrollToIndex({ index: 0 });
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <View style={[styles.iconContainer, { backgroundColor: `${COLORS.primary}15` }]}>
        <Ionicons name={item.icon} size={100} color={COLORS.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: COLORS.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.description, { color: COLORS.textSecondary }]}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeScreen>
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        
        {/* Decorative Background */}
        <View style={[styles.circle, { backgroundColor: COLORS.primary + '05', top: -100, right: -100, width: 300, height: 300 }]} />
        <View style={[styles.circle, { backgroundColor: COLORS.primary + '03', bottom: 100, left: -50, width: 200, height: 200 }]} />

        <View style={styles.topSection}>
          <Text style={[styles.logo, { color: COLORS.primary }]}>AgriVision</Text>
        </View>

        <FlatList
          data={SLIDES}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />

        <View style={styles.footer}>
          <View style={styles.paginator}>
            {SLIDES.map((_, i) => {
              const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 24, 8],
                extrapolate: 'clamp',
              });
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={i.toString()}
                  style={[styles.dot, { width: dotWidth, opacity, backgroundColor: COLORS.primary }]}
                />
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.primary }]}
            onPress={() => router.replace('/(auth)')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circle: {
    position: 'absolute',
    borderRadius: 150,
  },
  topSection: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  iconContainer: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
    opacity: 0.8,
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 50,
  },
  paginator: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    height: 64,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});

export default Onboarding;
