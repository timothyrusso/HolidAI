import { match } from 'ts-pattern';

import { colors } from '@/ui/style/colors';

// Define button states
export const ButtonState = { Active: 'active', Disabled: 'disabled' } as const;
export type ButtonState = (typeof ButtonState)[keyof typeof ButtonState];

export const ButtonType = {
  Main: 'main',
  Primary: 'primary',
  Secondary: 'secondary',
  Tertiary: 'tertiary',
  Quaternary: 'quaternary',
  Ghost: 'ghost',
} as const;

export type ButtonType = (typeof ButtonType)[keyof typeof ButtonType];

export const useCustomButtonLogic = () => {
  const getButtonStyles = (buttonType: ButtonType, buttonState: ButtonState) => {
    const isDisabled = buttonState === ButtonState.Disabled;

    return match({ buttonType, isDisabled })
      .with({ buttonType: ButtonType.Main, isDisabled: true }, () => ({
        backgroundColor: colors.primaryDisabled,
        borderColor: colors.primaryDisabled,
        textColor: colors.primaryWhite,
      }))
      .with({ buttonType: ButtonType.Main, isDisabled: false }, () => ({
        backgroundColor: colors.alpha,
        borderColor: colors.alpha,
        textColor: colors.primaryWhite,
      }))
      .with({ buttonType: ButtonType.Primary, isDisabled: true }, () => ({
        backgroundColor: colors.primaryBlackDisabled,
        borderColor: colors.primaryBlackDisabled,
        textColor: colors.primaryWhite,
      }))
      .with({ buttonType: ButtonType.Primary, isDisabled: false }, () => ({
        backgroundColor: colors.primaryBlack,
        borderColor: colors.primaryBlack,
        textColor: colors.primaryWhite,
      }))
      .with({ buttonType: ButtonType.Secondary, isDisabled: true }, () => ({
        backgroundColor: colors.primaryWhiteDisabled,
        borderColor: colors.secondaryGrey,
        textColor: colors.primaryBlackDisabled,
      }))
      .with({ buttonType: ButtonType.Secondary, isDisabled: false }, () => ({
        backgroundColor: colors.primaryWhite,
        borderColor: colors.secondaryGrey,
        textColor: colors.primaryBlack,
      }))
      .with({ buttonType: ButtonType.Tertiary, isDisabled: true }, () => ({
        backgroundColor: colors.primaryWhiteDisabled,
        borderColor: colors.primaryWhiteDisabled,
        textColor: colors.primaryBlackDisabled,
      }))
      .with({ buttonType: ButtonType.Tertiary, isDisabled: false }, () => ({
        backgroundColor: colors.primaryWhite,
        borderColor: colors.primaryWhite,
        textColor: colors.primaryBlack,
      }))
      .with({ buttonType: ButtonType.Quaternary, isDisabled: true }, () => ({
        backgroundColor: colors.secondaryGrey,
        borderColor: colors.secondaryGrey,
        textColor: colors.primaryBlackDisabled,
      }))
      .with({ buttonType: ButtonType.Quaternary, isDisabled: false }, () => ({
        backgroundColor: colors.secondaryGrey,
        borderColor: colors.secondaryGrey,
        textColor: colors.primaryBlack,
      }))
      .with({ buttonType: ButtonType.Ghost, isDisabled: true }, () => ({
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: colors.primaryBlackDisabled,
      }))
      .with({ buttonType: ButtonType.Ghost, isDisabled: false }, () => ({
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: colors.primaryBlack,
      }))
      .exhaustive();
  };

  const styleIconColor = (buttonType: ButtonType, buttonState: ButtonState) => {
    const isDisabled = buttonState === ButtonState.Disabled;

    return match({ buttonType, isDisabled })
      .with({ buttonType: ButtonType.Main, isDisabled: true }, () => colors.primaryWhiteDisabled)
      .with({ buttonType: ButtonType.Main, isDisabled: false }, () => colors.primaryWhite)
      .with({ buttonType: ButtonType.Primary, isDisabled: true }, () => colors.primaryWhiteDisabled)
      .with({ buttonType: ButtonType.Primary, isDisabled: false }, () => colors.primaryWhite)
      .with({ buttonType: ButtonType.Secondary, isDisabled: true }, () => colors.primaryBlackDisabled)
      .with({ buttonType: ButtonType.Secondary, isDisabled: false }, () => colors.primaryBlack)
      .with({ buttonType: ButtonType.Tertiary, isDisabled: true }, () => colors.primaryBlackDisabled)
      .with({ buttonType: ButtonType.Tertiary, isDisabled: false }, () => colors.primaryBlack)
      .with({ buttonType: ButtonType.Quaternary, isDisabled: true }, () => colors.primaryBlackDisabled)
      .with({ buttonType: ButtonType.Quaternary, isDisabled: false }, () => colors.primaryBlack)
      .with({ buttonType: ButtonType.Ghost, isDisabled: true }, () => colors.primaryBlackDisabled)
      .with({ buttonType: ButtonType.Ghost, isDisabled: false }, () => colors.primaryBlack)
      .exhaustive();
  };

  return {
    styleIconColor,
    getButtonStyles,
  };
};
