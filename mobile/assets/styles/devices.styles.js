import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.black,
    marginTop: 12,
  },
  section: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: -0.5,
  },
  sectionTitleSmall: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '800',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.black,
  },
  actionButtonText: {
    color: COLORS.black,
    fontWeight: '800',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.black,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '600',
  },
  errorContainer: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontWeight: '800',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});

export default styles;
