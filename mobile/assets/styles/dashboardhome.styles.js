// styles/create.styles.js
import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 36,
  },
  section: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },

  // grid helper: stacked vertical list but tighter spacing
  gridTwo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
  },
});

export default styles;
