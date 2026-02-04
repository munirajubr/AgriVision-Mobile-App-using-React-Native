import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 24,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: COLORS.black,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
    paddingVertical: 14,
    fontWeight: '600',
  },
  categoryWrapper: {
    height: 50,
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.black,
    marginHorizontal: 4,
    height: 40,
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.black,
    textTransform: 'uppercase',
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  priceList: {
    flex: 1,
  },
  priceListContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  priceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: COLORS.black,
  },
  priceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.black,
    marginBottom: 4,
  },
  cropCategory: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primary,
  },
  unit: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  priceCardBody: {
    flexDirection: 'column',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  location: {
    fontSize: 13,
    color: COLORS.black,
    fontWeight: '700',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.black,
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontWeight: '600',
  },
});

export default styles;