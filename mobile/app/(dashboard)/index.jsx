import { View, ScrollView, StyleSheet } from "react-native";
import Card from "../../components/Card";
import COLORS from "../../constants/colors";
import styles from "../../assets/styles/dashboardhome.styles";

export default function Home() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Featured Section */}
      <View style={styles.section}>
        <Card
          variant="large"
          image={require("../../assets/images/diagnosis-icon.png")}
          title="Disease Diagnosis"
          link="/(pages)/diagnosis"
        />
        <Card
          variant="horizontal"
          icon="analytics-outline"
          title="Upload NPK Report"
          link="/(pages)/npkuploadpage"
          iconColor="#037B21"
        />

        <Card
          variant="horizontal"
          icon="leaf-outline"
          title="Crop Info"
          link="/(pages)/cropguide"
          iconColor="#037B21"
        />

        <Card
          variant="horizontal"
          icon="flask-outline"
          title="Fertilizer Guide"
          link="/(pages)/fertilizerguide"
          iconColor="#037B21"
        />
      </View>
    </ScrollView>
  );
}