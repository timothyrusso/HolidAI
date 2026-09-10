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
        accessible
        accessibilityRole="checkbox"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={derived.accessibilityState}
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
