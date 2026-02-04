// styles/login.styles.js
import { StyleSheet, Dimensions } from "react-native";
import COLORS from "../../constants/colors";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 24,
  },
  topSection: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: COLORS.black,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 17,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontWeight: '500',
  },
  formContainer: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 16,
    backgroundColor: '#F2F2F7', // iOS Light Gray Background for inputs
    borderRadius: 16, // Softer corners
    paddingHorizontal: 16,
    height: 60,
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: COLORS.black,
    paddingVertical: 0,
  },
  inputIcon: {
    marginRight: 10,
  },
  eyeIcon: {
    padding: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 28, // Rounded pill-style button
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    gap: 6,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  link: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 15,
  },
});

export default styles;
