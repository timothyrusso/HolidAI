import { colors } from '@/features/core/ui/style/colors';
import { components } from '@/features/core/ui/style/dimensions/components';
import { fontSize } from '@/features/core/ui/style/dimensions/fontSize';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';
import { fontFamily } from '@/features/core/ui/style/fontFamily';
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
