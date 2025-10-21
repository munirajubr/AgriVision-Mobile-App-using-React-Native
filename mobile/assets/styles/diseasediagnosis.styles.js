import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  symptomText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  treatmentText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  issueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4433610',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  issueText: {
    fontSize: 14,
    color: '#F44336',
    marginLeft: 8,
    flex: 1,
  },
  tipsCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
});


export default styles;