import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },

  // HEADER
  header: {
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  // SEARCH
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    marginBottom: 16,
    marginTop: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    paddingVertical: 12,
  },

  // CATEGORY
  categoryWrapper: {
    height: 48,
    marginBottom: 16,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 4,
    height: 36,
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    color: COLORS.white,
  },

  // CROP LIST
  cropList: {
    flex: 1,
  },
  cropListContent: {
    paddingBottom: 60,
  },

  // CROP CARD
  cropCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cropCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cropName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cropCategory: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  cropStats: {
    alignItems: 'flex-end',
  },
  cropYield: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // CROP DETAILS
  cropCardBody: {
    marginTop: 6,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textPrimary,
    marginTop: 8,
  },

  // EMPTY STATE
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.placeholderText,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 260,
  },
});

export default styles;
