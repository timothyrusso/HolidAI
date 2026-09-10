import { View } from 'react-native';

import { BlurSurface } from '@/features/core/design-system/components/basic/CustomBlurButton/BlurSurface';
import {
  type CustomBlurCheckboxProps,
  useCustomBlurCheckboxLogic,
} from '@/features/core/design-system/components/basic/CustomBlurCheckbox/CustomBlurCheckbox.logic';
import { customBlurCheckboxStyles } from '@/features/core/design-system/components/basic/CustomBlurCheckbox/CustomBlurCheckbox.style';
import { CustomIcon } from '@/features/core/design-system/components/basic/CustomIcon/CustomIcon';
import { CustomPressable } from '@/features/core/design-system/components/basic/CustomPressable/CustomPressable';

/** The frosted sibling of `CustomCheckbox`, for the photo backgrounds a solid fill would fight. */
export const CustomBlurCheckbox = ({
  state,
  onChange,
  size,
  accessibilityLabel,
  blurTargetRef,
  style,
}: CustomBlurCheckboxProps) => {
  const { derived, effects } = useCustomBlurCheckboxLogic({
    state,
    size,
    onChange,
    hasBlurTarget: blurTargetRef !== undefined,
  });

  const styles = customBlurCheckboxStyles({
    box: derived.box,
    slop: derived.slop,
    tintOpacity: derived.tintOpacity,
    ringOpacity: derived.ringOpacity,
  });

  return (
    <CustomPressable
      style={[styles.container, style]}
      onPress={effects.onPress}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={derived.accessibilityState}
      // react-native-web drops the `accessibilityState` object form, so the flat ARIA prop is passed
      // alongside it; React Native merges it back into `accessibilityState` on device.
      aria-checked={derived.isChecked}
    >
      <View style={styles.checkbox}>
        <BlurSurface
          intensity={derived.intensity}
          canBlur={derived.canBlur}
          surfaceStyle={styles.surface}
          maskStyle={styles.mask}
          blurTargetRef={blurTargetRef}
        >
          <View style={styles.tint} />
          <View style={styles.ring} />
          <View
            style={styles.innerContainer}
            aria-hidden
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            {derived.isChecked && (
              <CustomIcon name={derived.glyphName} size={derived.glyph} color={derived.glyphColor} />
            )}
          </View>
        </BlurSurface>
      </View>
    </CustomPressable>
  );
};
