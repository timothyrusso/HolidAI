import { colors } from '@/ui/constants/style/colors';
import { components } from '@/ui/constants/style/dimensions/components';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
  },
  body: {
    width: '100%',
    marginBottom: spacing.separator40,
    paddingHorizontal: spacing.Quintuple,
  },
  footer: {
    width: '100%',
    height: components.modalFooterHeight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: spacing.Double,
    paddingHorizontal: spacing.Quintuple,
    borderTopWidth: spacing.HalfMinimal,
    borderTopColor: colors.primaryGrey,
    backgroundColor: colors.primaryWhite,
    borderBottomLeftRadius: spacing.Triple,
    borderBottomRightRadius: spacing.Triple,
  },
  fixedFooterContainer: {
    gap: spacing.SingleAndHalf,
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
  },
  button: {
    marginVertical: spacing.Zero,
    marginHorizontal: spacing.Zero,
  },
});
