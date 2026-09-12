import Animated from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import {
  type CustomSpinnerProps,
  SpinnerColor,
  useCustomSpinnerLogic,
} from '@/features/core/design-system/components/basic/CustomSpinner/CustomSpinner.logic';
import {
  customSpinnerStyles,
  spinnerRotation,
} from '@/features/core/design-system/components/basic/CustomSpinner/CustomSpinner.style';

const DEFAULT_SIZE = 'medium';

export const CustomSpinner = ({
  size = DEFAULT_SIZE,
  color = SpinnerColor.purple500,
  progress,
  accessibilityLabel,
  style,
}: CustomSpinnerProps) => {
  const { derived } = useCustomSpinnerLogic({ size, color, progress });

  const styles = customSpinnerStyles({ box: derived.box });

  return (
    <Animated.View
      style={[styles.container, derived.isIndeterminate ? spinnerRotation : null, style]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      aria-busy={derived.accessibilityBusy}
      aria-valuemin={derived.accessibilityValue?.min}
      aria-valuemax={derived.accessibilityValue?.max}
      aria-valuenow={derived.accessibilityValue?.now}
    >
      <Svg width={derived.box} height={derived.box}>
        <Circle
          cx={derived.center}
          cy={derived.center}
          r={derived.radius}
          fill="none"
          stroke={derived.spinnerColors.track}
          strokeOpacity={derived.spinnerColors.trackOpacity}
          strokeWidth={derived.strokeWidth}
        />
        {derived.hasArc && (
          <Circle
            cx={derived.center}
            cy={derived.center}
            r={derived.radius}
            fill="none"
            stroke={derived.spinnerColors.arc}
            strokeWidth={derived.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={derived.dashArray}
            strokeDashoffset={derived.dashOffset}
            transform={derived.arcRotation}
          />
        )}
      </Svg>
    </Animated.View>
  );
};
