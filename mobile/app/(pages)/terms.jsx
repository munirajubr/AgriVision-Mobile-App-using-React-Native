import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const TermsPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms & Conditions</Text>
      <Text style={styles.subtitle}>Legal terms and conditions will be here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default TermsPage;
