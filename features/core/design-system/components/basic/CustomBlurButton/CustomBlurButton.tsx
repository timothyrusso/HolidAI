import { Fragment, type RefObject } from 'react';
import { type StyleProp, type TextStyle, View, type ViewStyle } from 'react-native';

import { BlurSurface } from '@/features/core/design-system/components/basic/CustomBlurButton/BlurSurface';
import { useCustomBlurButtonLogic } from '@/features/core/design-system/components/basic/CustomBlurButton/CustomBlurButton.logic';
import { styleBlurButton } from '@/features/core/design-system/components/basic/CustomBlurButton/CustomBlurButton.style';
import { CustomIcon, type IoniconsName } from '@/features/core/design-system/components/basic/CustomIcon/CustomIcon';
import { CustomPressable } from '@/features/core/design-system/components/basic/CustomPressable/CustomPressable';
import { CustomSpinner } from '@/features/core/design-system/components/basic/CustomSpinner/CustomSpinner';
import { CustomText } from '@/features/core/design-system/components/basic/CustomText/CustomText';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';

export type CustomBlurButtonProps = {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  isDisabled?: boolean;
  isLoading?: boolean;
  size?: number;
  leftIcon?: IoniconsName;
  rightIcon?: IoniconsName;
  iconSize?: number;
  /**
   * The `BlurTargetView` ancestor whose pixels Android should blur — plumb it from the screen that
   * owns the background, exactly as the trip details box does over its hero image. Ignored on iOS,
   * which blurs whatever is behind the view.
   */
  blurTargetRef?: RefObject<View | null>;
};

export function CustomBlurButton({
  title,
  onPress,
  style,
  textStyle,
  isDisabled = false,
  isLoading = false,
  size,
  leftIcon,
  rightIcon,
  iconSize = spacing.TripleAndHalf,
  blurTargetRef,
}: CustomBlurButtonProps) {
  const { state, derived } = useCustomBlurButtonLogic({ isDisabled, hasBlurTarget: blurTargetRef !== undefined });

  const styles = styleBlurButton({
    tintOpacity: derived.blurStyles.tintOpacity,
    contentColor: derived.blurStyles.contentColor,
    height: size,
  });

  return (
    <CustomPressable
      disabled={isDisabled || isLoading}
      onPress={onPress}
      style={[styles.button, style]}
      accessibilityRole="button"
      accessibilityLabel={state.t(title)}
    >
      <BlurSurface
        intensity={derived.blurStyles.intensity}
        canBlur={derived.canBlur}
        surfaceStyle={styles.surface}
        maskStyle={styles.mask}
        blurTargetRef={blurTargetRef}
      >
        <View style={styles.tint} />
        <View style={styles.innerContainer}>
          {isLoading ? (
            <CustomSpinner size="small" color={derived.spinnerColor} />
          ) : (
            <Fragment>
              {leftIcon && (
                <CustomIcon
                  name={leftIcon}
                  size={iconSize}
                  style={styles.leftIcon}
                  color={derived.blurStyles.contentColor}
                />
              )}
              <CustomText style={[styles.text, textStyle]} text={title} numberOfLines={1} ellipsizeMode="tail" />
              {rightIcon && (
                <CustomIcon
                  name={rightIcon}
                  size={iconSize}
                  style={styles.rightIcon}
                  color={derived.blurStyles.contentColor}
                />
              )}
            </Fragment>
          )}
        </View>
      </BlurSurface>
    </CustomPressable>
  );
}
