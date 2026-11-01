import { renderHook } from '@testing-library/react-native';
import {
  ButtonState,
  ButtonType,
  useCustomButtonLogic,
} from '@/features/core/design-system/components/basic/CustomButton/CustomButton.logic';
import {
  clampProgress,
  SpinnerColor,
  spinnerSweep,
  useCustomSpinnerLogic,
} from '@/features/core/design-system/components/basic/CustomSpinner/CustomSpinner.logic';
import { colors } from '@/features/core/design-system/style/colors';

const renderButton = async () => (await renderHook(useCustomButtonLogic)).result.current.derived;

describe('useCustomButtonLogic', () => {
  it.each([
    [ButtonType.Main, ButtonState.Active, colors.purple500, colors.primaryWhite],
    [ButtonType.Main, ButtonState.Disabled, colors.purple300, colors.primaryWhite],
    [ButtonType.Primary, ButtonState.Active, colors.primaryBlack, colors.primaryWhite],
    [ButtonType.Primary, ButtonState.Disabled, colors.primaryGrey, colors.primaryWhite],
    [ButtonType.Secondary, ButtonState.Active, colors.primaryWhite, colors.primaryBlack],
    [ButtonType.Secondary, ButtonState.Disabled, colors.primaryWhiteDisabled, colors.primaryGrey],
    [ButtonType.Tertiary, ButtonState.Active, colors.primaryWhite, colors.primaryBlack],
    [ButtonType.Tertiary, ButtonState.Disabled, colors.primaryWhiteDisabled, colors.primaryGrey],
    [ButtonType.Quaternary, ButtonState.Active, colors.secondaryGrey, colors.primaryBlack],
    [ButtonType.Quaternary, ButtonState.Disabled, colors.secondaryGrey, colors.primaryGrey],
    [ButtonType.Ghost, ButtonState.Active, 'transparent', colors.primaryBlack],
    [ButtonType.Ghost, ButtonState.Disabled, 'transparent', colors.primaryGrey],
  ])('paints a %s %s button and its text', async (type, state, background, text) => {
    const { getButtonStyles } = await renderButton();

    expect(getButtonStyles(type, state)).toMatchObject({ backgroundColor: background, textColor: text });
  });

  it.each([
    [ButtonType.Main, ButtonState.Active, colors.primaryWhite],
    [ButtonType.Main, ButtonState.Disabled, colors.primaryWhite],
    [ButtonType.Primary, ButtonState.Active, colors.primaryWhite],
    [ButtonType.Primary, ButtonState.Disabled, colors.primaryWhite],
    [ButtonType.Secondary, ButtonState.Active, colors.primaryBlack],
    [ButtonType.Secondary, ButtonState.Disabled, colors.primaryGrey],
    [ButtonType.Tertiary, ButtonState.Active, colors.primaryBlack],
    [ButtonType.Tertiary, ButtonState.Disabled, colors.primaryGrey],
    [ButtonType.Quaternary, ButtonState.Active, colors.primaryBlack],
    [ButtonType.Quaternary, ButtonState.Disabled, colors.primaryGrey],
    [ButtonType.Ghost, ButtonState.Active, colors.primaryBlack],
    [ButtonType.Ghost, ButtonState.Disabled, colors.primaryGrey],
  ])('colours the icon of a %s %s button', async (type, state, icon) => {
    const { styleIconColor } = await renderButton();

    expect(styleIconColor(type, state)).toBe(icon);
  });

  it('spins white on a dark button and black on a light one', async () => {
    const { styleSpinnerColor } = await renderButton();

    expect([styleSpinnerColor(ButtonType.Primary), styleSpinnerColor(ButtonType.Secondary)]).toEqual([
      SpinnerColor.primaryWhite,
      SpinnerColor.primaryBlack,
    ]);
  });
});

describe('clampProgress', () => {
  it.each([
    [-0.5, 0],
    [0.4, 0.4],
    [1.7, 1],
    [Number.NaN, 0],
  ])('clamps %p to %p', (progress, clamped) => {
    expect(clampProgress(progress)).toBe(clamped);
  });
});

describe('spinnerSweep', () => {
  it('sweeps three quarters of a turn when there is no progress to show', () => {
    expect(spinnerSweep()).toBe(0.75);
  });
});

describe('useCustomSpinnerLogic', () => {
  it('spins indeterminately, busy and with no value, without a progress', async () => {
    const { result } = await renderHook(useCustomSpinnerLogic, {
      initialProps: { size: 'small' as const, color: SpinnerColor.purple500 },
    });

    expect(result.current.derived).toMatchObject({ isIndeterminate: true, accessibilityBusy: true, hasArc: true });
    expect(result.current.derived.accessibilityValue).toBeUndefined();
  });

  it('shows a progress as a percentage, on a faint white track for a white arc', async () => {
    const { result } = await renderHook(useCustomSpinnerLogic, {
      initialProps: { size: 'small' as const, color: SpinnerColor.primaryWhite, progress: 0.42 },
    });

    expect(result.current.derived.accessibilityValue).toEqual({ min: 0, max: 100, now: 42 });
    expect(result.current.derived.spinnerColors.track).toBe(colors.primaryWhite);
  });

  it('draws no arc for no progress', async () => {
    const { result } = await renderHook(useCustomSpinnerLogic, {
      initialProps: { size: 'small' as const, color: SpinnerColor.purple500, progress: 0 },
    });

    expect(result.current.derived.hasArc).toBe(false);
  });
});
