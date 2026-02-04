import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.black,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 16, // Softer rounded inputs
    padding: 16,
    fontSize: 16,
    color: COLORS.black,
    borderWidth: 1.5,
    borderColor: COLORS.black,
    fontWeight: '700',
  },
  suggestButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 28, // Pill button
    marginTop: 20,
    marginBottom: 40,
  },
  suggestButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 8,
    textTransform: 'uppercase',
  },
});

export default styles;