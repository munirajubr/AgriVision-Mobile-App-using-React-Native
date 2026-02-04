import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: COLORS.black,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  idBadge: {
    backgroundColor: COLORS.black,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  idText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.white,
  },
  menuBtn: {
    padding: 4,
  },
  inlineMenu: {
    position: 'absolute',
    right: 12,
    top: 40,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    padding: 4,
    width: 150,
    zIndex: 100,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  deleteText: {
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 13,
  },
  cancelText: {
    color: COLORS.black,
    fontWeight: '600',
    fontSize: 13,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 2,
  },
  imageWrap: {
    width: '100%',
    height: 180,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: COLORS.border,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  noImageText: {
    color: COLORS.black,
    fontSize: 13,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  metricBox: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.black,
    backgroundColor: COLORS.white,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.black,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.black,
    marginBottom: 16,
  },
  predictionArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  predContent: {
    flex: 1,
  },
  predTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: 0.5,
  },
  predValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  diagnoseBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20, // Rounded pill button
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  diagnoseText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 11,
    textTransform: 'uppercase',
  },
});
