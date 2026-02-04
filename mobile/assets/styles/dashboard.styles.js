import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.black,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  subHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
    gap: 10,
    marginTop: 15,
    marginBottom: 10,
  },
  subHeaderTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  subHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.black,
  },
  activeTabText: {
    color: COLORS.white,
  },
  activeTabIndicator: {
    display: 'none', // Removed for cleaner look
  },
  contentContainer: {
    paddingTop: 10,
  },
});

export default styles;
