import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const styles = StyleSheet.create({
  // Large card styles (for Featured Diagnosis)
  largeCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 40,
    marginVertical: 8,
    marginHorizontal: 16,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  largeImage: {
    width: 75,
    height: 75,
    marginBottom: 20,
  },
  largeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Horizontal card styles (for Quick Actions)
  horizontalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 18,
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${COLORS.primary}15`, // 15% opacity background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  horizontalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    letterSpacing: 0.3,
  },
});

export default styles;
