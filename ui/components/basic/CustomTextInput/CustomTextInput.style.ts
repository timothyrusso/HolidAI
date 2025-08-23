import { colors } from '@/ui/constants/style/colors';
import { components } from '@/ui/constants/style/dimensions/components';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { fonts } from '@/ui/constants/style/fonts';
import { StyleSheet } from 'react-native';

export const styles = (isPassword: boolean) =>
  StyleSheet.create({
    input: {
      width: '100%',
      color: colors.primaryBlack,
      fontFamily: fonts.interRegular,
      fontSize: spacing.Triple,
      paddingHorizontal: spacing.Double,
      height: components.customInputHeight,
    },
    container: {
      borderRadius: spacing.Double,
      padding: spacing.MinimalDouble,
      backgroundColor: colors.secondaryGrey,
      ...(isPassword && {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }),
    },
    eyeButton: {
      position: 'absolute',
      right: spacing.MinimalDouble,
    },
  });
