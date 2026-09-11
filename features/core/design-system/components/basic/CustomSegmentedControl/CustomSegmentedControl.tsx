import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { CustomIcon } from '@/features/core/design-system/components/basic/CustomIcon/CustomIcon';
import { CustomPressable } from '@/features/core/design-system/components/basic/CustomPressable/CustomPressable';
import {
  type CustomSegmentedControlProps,
  SegmentedControlThumbFill,
  useCustomSegmentedControlLogic,
} from '@/features/core/design-system/components/basic/CustomSegmentedControl/CustomSegmentedControl.logic';
import { customSegmentedControlStyles } from '@/features/core/design-system/components/basic/CustomSegmentedControl/CustomSegmentedControl.style';
import type { SegmentedControlSize } from '@/features/core/design-system/style/dimensions/segmentedControl';

const NO_PRESS_SCALE = 1;

type CustomSegmentedControlInternalProps = CustomSegmentedControlProps & {
  size: SegmentedControlSize;
};

export const CustomSegmentedControl = ({
  segments,
  selectedIndex,
  onChange,
  thumbFill = SegmentedControlThumbFill.White,
  isDisabled = false,
  style,
  size,
}: CustomSegmentedControlInternalProps) => {
  const { state, derived, effects } = useCustomSegmentedControlLogic({
    segmentCount: segments.length,
    selectedIndex,
    onChange,
    thumbFill,
    isDisabled,
  });

  const styles = customSegmentedControlStyles({
    size,
    segmentCount: segments.length,
    controlColors: derived.controlColors,
    isDisabled,
  });

  return (
    <View style={[styles.track, style]} accessibilityRole="tablist">
      <View style={styles.inner} onLayout={effects.onTrackLayout}>
        <Animated.View
          style={[styles.thumb, derived.thumbAnimatedStyle]}
          pointerEvents="none"
          aria-hidden
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        {segments.map((segment, index) => (
          <CustomPressable
            key={segment.label}
            style={styles.segment}
            scaleValue={NO_PRESS_SCALE}
            disabled={isDisabled}
            onPress={() => effects.onSegmentPress(index)}
            accessibilityRole="tab"
            accessibilityLabel={state.t(segment.label)}
            accessibilityState={{ selected: derived.isSelected(index), disabled: isDisabled }}
            // NOTE: react-native-web drops `accessibilityState.selected`, so a web tab reaches the
            // a11y tree with no selected state unless the ARIA prop is passed alongside it.
            aria-selected={derived.isSelected(index)}
          >
            <Animated.View style={[styles.segmentContent, derived.contentAnimatedStyles[index]]}>
              {segment.icon && (
                <View style={styles.iconStack}>
                  <CustomIcon
                    name={segment.icon}
                    size={size.iconSize}
                    color={derived.controlColors.unselectedContentColor}
                  />
                  <Animated.View
                    style={[styles.iconOverlay, derived.iconOverlayAnimatedStyles[index]]}
                    pointerEvents="none"
                    aria-hidden
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                  >
                    <CustomIcon
                      name={segment.icon}
                      size={size.iconSize}
                      color={derived.controlColors.selectedContentColor}
                    />
                  </Animated.View>
                </View>
              )}
              <Animated.Text
                style={[styles.label, derived.labelAnimatedStyles[index]]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {state.t(segment.label)}
              </Animated.Text>
            </Animated.View>
          </CustomPressable>
        ))}
      </View>
    </View>
  );
};
