import type { RefObject } from 'react';
import { Platform, type StyleProp, type View, type ViewStyle } from 'react-native';

import { CheckboxState } from '@/features/core/design-system/components/basic/CustomCheckbox/CustomCheckbox.logic';
import { PlatformOS } from '@/features/core/design-system/PlatformOS';
import { blur } from '@/features/core/design-system/style/blur';
import { colors } from '@/features/core/design-system/style/colors';
import { type CheckboxSizeName, checkboxSizes } from '@/features/core/design-system/style/dimensions/checkbox';
import { icons } from '@/features/core/design-system/style/icons';
import { opacity } from '@/features/core/design-system/style/opacity';

export type BlurCheckboxState = Exclude<CheckboxState, typeof CheckboxState.empty>;

export type CustomBlurCheckboxProps = {
  state: BlurCheckboxState;
  onChange: (next: boolean) => void;
  size?: CheckboxSizeName;
  accessibilityLabel: string;
  /**
   * The `BlurTargetView` ancestor whose pixels Android should blur — plumb it from the screen that
   * owns the background. Ignored on iOS, which blurs whatever is behind the view.
   */
  blurTargetRef?: RefObject<View | null>;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_SIZE: CheckboxSizeName = 'medium';

type UseCustomBlurCheckboxLogicParams = {
  state: BlurCheckboxState;
  size?: CheckboxSizeName;
  onChange: (next: boolean) => void;
  hasBlurTarget: boolean;
};

export const useCustomBlurCheckboxLogic = ({
  state,
  size = DEFAULT_SIZE,
  onChange,
  hasBlurTarget,
}: UseCustomBlurCheckboxLogicParams) => {
  const { box, glyph, slop } = checkboxSizes[size];
  const isChecked = state === CheckboxState.checked;

  // `expo-blur` can only sample the pixels behind it on Android when it is handed a `blurTarget`
  // ancestor, which a reusable component cannot own: without one, there is no blur to render.
  const canBlur = Platform.OS !== PlatformOS.android || hasBlurTarget;

  const onPress = () => onChange(!isChecked);

  return {
    derived: {
      box,
      glyph,
      isChecked,
      canBlur,
      intensity: blur.intensity30,
      // The design's white@50 / white@60 rings map exactly; only its black@12 unchecked fill has to
      // round to the nearest rung of the opacity ladder.
      tintOpacity: isChecked ? opacity.opacity25 : opacity.opacity10,
      ringOpacity: isChecked ? opacity.opacity50 : opacity.opacity60,
      glyphName: icons.checkmark,
      glyphColor: colors.primaryWhite,
      slop,
      accessibilityState: { checked: isChecked },
    },
    effects: {
      onPress,
    },
  };
};
