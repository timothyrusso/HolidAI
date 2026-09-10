import { StyleSheet } from 'react-native';

import { colors } from '@/features/core/design-system/style/colors';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';

type CustomBlurCheckboxStyleParams = {
  box: number;
  touchPadding: number;
  tintOpacity: number;
  ringOpacity: number;
};

export const customBlurCheckboxStyles = ({
  box,
  touchPadding,
  tintOpacity,
  ringOpacity,
}: CustomBlurCheckboxStyleParams) => {
  const radius = box / 2;

  return StyleSheet.create({
    // The pressable's own box carries the touch target, grown by `touchPadding` and pulled back
    // out of the layout with a negative margin: react-native-web ignores `hitSlop`, so a medium
    // checkbox is only tappable past its edge if the element itself is the bigger one.
    container: {
      width: box + touchPadding * 2,
      height: box + touchPadding * 2,
      margin: -touchPadding,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkbox: {
      width: box,
      height: box,
      borderRadius: radius,
      overflow: 'hidden',
    },
    surface: {
      flex: 1,
      width: '100%',
    },
    mask: {
      flex: 1,
      borderRadius: radius,
      backgroundColor: colors.primaryBlack,
    },
    tint: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.primaryBlack,
      opacity: tintOpacity,
    },
    // An overlay, because a translucent ring cannot be drawn as a container border without fading
    // the glyph inside it with it.
    ring: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: radius,
      borderWidth: spacing.HalfMinimal,
      borderColor: colors.primaryWhite,
      opacity: ringOpacity,
    },
    innerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
