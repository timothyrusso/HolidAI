import { colors } from '@/ui/style/colors';
import { components } from '@/ui/style/dimensions/components';
import { fontSize } from '@/ui/style/dimensions/fontSize';
import { spacing } from '@/ui/style/dimensions/spacing';
import { fontFamily } from '@/ui/style/fontFamily';
import { StyleSheet } from 'react-native';

export const styles = (isPassword: boolean) =>
  StyleSheet.create({
    input: {
      width: '100%',
      color: colors.primaryBlack,
      fontFamily: fontFamily.interRegular,
      fontSize: fontSize.LG,
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
