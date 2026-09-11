import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { match } from 'ts-pattern';

import { ButtonState } from '@/features/core/design-system/components/basic/CustomButton/CustomButton.logic';
import { spinnerColorForContent } from '@/features/core/design-system/components/basic/CustomSpinner/CustomSpinner.logic';
import { PlatformOS } from '@/features/core/design-system/PlatformOS';
import { blur } from '@/features/core/design-system/style/blur';
import { colors } from '@/features/core/design-system/style/colors';
import { opacity } from '@/features/core/design-system/style/opacity';

export type BlurButtonStyles = {
  intensity: number;
  tintOpacity: number;
  contentColor: string;
};

const resolveBlurStyles = (buttonState: ButtonState, canBlur: boolean): BlurButtonStyles =>
  match({ buttonState, canBlur })
    .with({ buttonState: ButtonState.Active, canBlur: true }, () => ({
      intensity: blur.intensity30,
      tintOpacity: opacity.opacity25,
      contentColor: colors.primaryWhite,
    }))
    .with({ buttonState: ButtonState.Active, canBlur: false }, () => ({
      intensity: blur.intensity30,
      tintOpacity: opacity.opacity60,
      contentColor: colors.primaryWhite,
    }))
    .with({ buttonState: ButtonState.Disabled, canBlur: true }, () => ({
      intensity: blur.intensity15,
      tintOpacity: opacity.opacity10,
      contentColor: colors.primaryWhiteDisabled,
    }))
    .with({ buttonState: ButtonState.Disabled, canBlur: false }, () => ({
      intensity: blur.intensity15,
      tintOpacity: opacity.opacity40,
      contentColor: colors.primaryWhiteDisabled,
    }))
    .exhaustive();

type UseCustomBlurButtonLogicParams = {
  isDisabled: boolean;
  hasBlurTarget: boolean;
};

export const useCustomBlurButtonLogic = ({ isDisabled, hasBlurTarget }: UseCustomBlurButtonLogicParams) => {
  const { t } = useTranslation();

  const buttonState = isDisabled ? ButtonState.Disabled : ButtonState.Active;

  // NOTE: `expo-blur` can only sample the pixels behind it on Android when it is handed a `blurTarget`
  // ancestor, which a reusable button cannot own: without one from the screen, there is no blur to
  // render at all.
  const canBlur = Platform.OS !== PlatformOS.android || hasBlurTarget;

  const blurStyles = resolveBlurStyles(buttonState, canBlur);

  return {
    state: {
      t,
    },
    derived: {
      canBlur,
      blurStyles,
      spinnerColor: spinnerColorForContent(resolveBlurStyles(ButtonState.Active, canBlur).contentColor),
    },
  };
};
