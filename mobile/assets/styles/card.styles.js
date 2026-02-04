import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const styles = StyleSheet.create({
  largeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 24,
    marginVertical: 10,
    marginHorizontal: 20,
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.black,
  },
  largeTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.black,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 12,
  },
  horizontalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 24,
    borderWidth: 1.5,
    borderColor: COLORS.black,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  horizontalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.black,
    flex: 1,
    textTransform: 'uppercase',
  },
});

export default styles;
