import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import COLORS from '../constants/colors';
import styles from '../assets/styles/card.styles';

const Card = ({ image, icon, title, link, variant = 'horizontal', iconColor }) => {
  const router = useRouter();

  const handlePress = () => {
    if (link) {
      router.push(link);
    }
  };

  // Large card with centered image (for Diagnosis)
  if (variant === 'large') {
    return (
      <TouchableOpacity 
        style={styles.largeCard} 
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {image && (
          <Image 
            source={image}
            style={styles.largeImage}
            resizeMode="contain"
          />
        )}
        <Text style={styles.largeTitle}>{title}</Text>
      </TouchableOpacity>
    );
  }

  // Horizontal card with icon on left (for others)
  return (
    <TouchableOpacity 
      style={styles.horizontalCard} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons 
          name={icon} 
          size={32} 
          color={iconColor || COLORS.primary} 
        />
      </View>
      <Text style={styles.horizontalTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Card;
