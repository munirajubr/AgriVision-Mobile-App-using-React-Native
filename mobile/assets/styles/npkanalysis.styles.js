import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    paddingTop: 40,
    backgroundColor: COLORS.white,
  },
  backButton: { marginRight: 16 },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: "900", 
    color: COLORS.black,
    letterSpacing: -1,
  },
  soilSummary: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 8,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.black,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.black,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  npkContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between",
  },
  npkItem: { alignItems: "center" },
  npkLabel: {
    fontSize: 11,
    color: COLORS.primary,
    marginBottom: 4,
    fontWeight: "800",
    textTransform: 'uppercase',
  },
  npkValue: { 
    fontSize: 18, 
    fontWeight: "900", 
    color: COLORS.black 
  },
  section: { 
    paddingHorizontal: 24, 
    marginBottom: 24 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.black,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
    fontWeight: '600',
  },
  cropCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.black,
  },
  cropCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cropInfo: {
    flexDirection: "column",
  },
  cropName: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.black,
  },
  cropCategory: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  cropStats: { alignItems: "flex-end" },
  cropYield: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.black,
  },
  cropCardBody: { 
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black,
    marginTop: 12,
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 8,
    padding: 16,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  homeButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 28, // Pill button
    marginHorizontal: 24,
    marginBottom: 32,
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
    marginLeft: 8,
    textTransform: 'uppercase',
  },
});

export default styles;