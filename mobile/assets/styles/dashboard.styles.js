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
    height: 20,
    backgroundColor: COLORS.background,
  },
  welcomeContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'flex-start',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  subHeaderTab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  subHeaderText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default styles;
