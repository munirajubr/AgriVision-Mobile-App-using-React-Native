import React from 'react';
import { View, ScrollView } from 'react-native';
import Card from '../../components/Card';
import styles from '../../assets/styles/dashboardhome.styles';

const cardsData = [
  {
    variant: 'large',
    image: require('../../assets/images/diagnosis-icon.png'),
    title: 'Disease Diagnosis',
    link: '/(pages)/diagnosis',
  },
  {
    variant: 'horizontal',
    icon: 'analytics-outline',
    title: 'Upload NPK Report',
    link: '/(pages)/npkupload',
    iconColor: '#037B21',
  },
  // {
  //   variant: 'horizontal',
  //   icon: 'leaf-outline',
  //   title: 'Crop Info',
  //   link: '/(pages)/cropguide',
  //   iconColor: '#037B21',
  // },
  // {
  //   variant: 'horizontal',
  //   icon: 'flask-outline',
  //   title: 'Fertilizer Guide',
  //   link: '/(pages)/fertilizerguide',
  //   iconColor: '#037B21',
  // },
];

export default function Home() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        {cardsData.map((card, idx) => (
          <Card
            key={idx}
            variant={card.variant}
            image={card.image}
            icon={card.icon}
            iconColor={card.iconColor}
            title={card.title}
            link={card.link}
          />
        ))}
      </View>
    </ScrollView>
  );
}
