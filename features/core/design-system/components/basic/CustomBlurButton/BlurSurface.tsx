import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import type { PropsWithChildren, RefObject } from 'react';
import { Platform, type StyleProp, View, type ViewStyle } from 'react-native';

import { styles } from '@/features/core/design-system/components/basic/CustomBlurButton/BlurSurface.style';
import { PlatformOS } from '@/features/core/design-system/PlatformOS';

type BlurSurfaceProps = PropsWithChildren<{
  intensity: number;
  canBlur: boolean;
  surfaceStyle: StyleProp<ViewStyle>;
  maskStyle: StyleProp<ViewStyle>;
  blurTargetRef?: RefObject<View | null>;
}>;

/**
 * The backdrop of a blur button, shared by the pill and the icon variants. It exists because the
 * platforms disagree on how a blur is produced and clipped, and neither shape fits inside
 * `BaseButton`'s single-`View` structure.
 */
export const BlurSurface = ({
  intensity,
  canBlur,
  surfaceStyle,
  maskStyle,
  blurTargetRef,
  children,
}: BlurSurfaceProps) => {
  if (!canBlur) {
    return <View style={surfaceStyle}>{children}</View>;
  }

  // NOTE: Android's blur ignores `borderRadius` on its own view, so the rounded shape comes from a mask.
  if (Platform.OS === PlatformOS.android) {
    return (
      <MaskedView style={surfaceStyle} maskElement={<View style={maskStyle} />}>
        <BlurView
          intensity={intensity}
          style={styles.androidBlur}
          blurMethod="dimezisBlurView"
          blurTarget={blurTargetRef}
          tint="dark"
        >
          {children}
        </BlurView>
      </MaskedView>
    );
  }

  return (
    <BlurView intensity={intensity} style={surfaceStyle} tint="dark">
      {children}
    </BlurView>
  );
};
