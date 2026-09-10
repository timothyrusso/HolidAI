import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import {
  type CustomCheckboxProps,
  useCustomCheckboxLogic,
} from '@/features/core/design-system/components/basic/CustomCheckbox/CustomCheckbox.logic';
import { customCheckboxStyles } from '@/features/core/design-system/components/basic/CustomCheckbox/CustomCheckbox.style';
import { CustomIcon } from '@/features/core/design-system/components/basic/CustomIcon/CustomIcon';
import { CustomPressable } from '@/features/core/design-system/components/basic/CustomPressable/CustomPressable';

/**
 * A circular checkbox. Only the `empty` ring is an SVG, because React Native renders
 * `borderStyle: 'dashed'` solid on iOS as soon as the radius is rounded, which would drop that
 * state's only distinguishing feature. The animating ring is a plain border: it swaps in as a
 * separate element, so a dash pattern can never survive into the state that fills the circle.
 */
export const CustomCheckbox = (props: CustomCheckboxProps) => {
  const { derived, effects } = useCustomCheckboxLogic(props);

  const { style, accessibilityLabel } = props;

  const styles = customCheckboxStyles({
    box: derived.box,
    strokeWidth: derived.strokeWidth,
    touchPadding: derived.touchPadding,
  });

  const glyph = <CustomIcon name={derived.glyphName} size={derived.glyph} color={derived.glyphColor} />;

  const content = (
    <View style={styles.box}>
      {derived.isEmpty ? (
        <Svg width={derived.box} height={derived.box} style={styles.ring} pointerEvents="none">
          <Circle
            cx={derived.center}
            cy={derived.center}
            r={derived.radius}
            fill="none"
            stroke={derived.neutralRingColor}
            strokeWidth={derived.strokeWidth}
            strokeDasharray={derived.dashArray}
          />
        </Svg>
      ) : (
        <Animated.View style={[styles.ring, derived.ringAnimatedStyle]} />
      )}
      {derived.hasNeutralOutline && <View style={styles.outline} />}
      <View aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {derived.isEmpty ? glyph : <Animated.View style={derived.checkmarkAnimatedStyle}>{glyph}</Animated.View>}
      </View>
    </View>
  );

  if (!derived.isInteractive) {
    return (
      <View
        style={[styles.container, style]}
        // A role alone never makes a native view an accessibility element, so the static checkbox
        // would be skipped entirely without this.
        accessible
        accessibilityRole="checkbox"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={derived.accessibilityState}
        // react-native-web drops the `accessibilityState` object form, so the flat ARIA props are
        // passed alongside it; React Native merges them back into `accessibilityState` on device.
        aria-checked={derived.isChecked}
        aria-disabled
      >
        {content}
      </View>
    );
  }

  return (
    <CustomPressable
      style={[styles.container, style]}
      onPress={effects.onPress}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={derived.accessibilityState}
      aria-checked={derived.isChecked}
    >
      {content}
    </CustomPressable>
  );
};
