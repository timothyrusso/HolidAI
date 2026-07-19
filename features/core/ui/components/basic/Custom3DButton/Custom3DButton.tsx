import { Fragment } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {
  CUSTOM_3D_BUTTON_DEFAULTS,
  useCustom3DButtonLogic,
} from '@/features/core/ui/components/basic/Custom3DButton/Custom3DButton.logic';
import { custom3DButtonStyles } from '@/features/core/ui/components/basic/Custom3DButton/Custom3DButton.style';
import { CustomIcon, type IoniconsName } from '@/features/core/ui/components/basic/CustomIcon/CustomIcon';
import { CustomText } from '@/features/core/ui/components/basic/CustomText/CustomText';

export type Custom3DButtonProps = {
  children?: string;
  onPress?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  leftIcon?: IoniconsName;
  rightIcon?: IoniconsName;
  iconSize?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  raisedColor?: string;
  shadowColor?: string;
  raiseLevel?: number;
  height?: number;
  width?: number;
  stretch?: boolean;
  textColor?: string;
  textSize?: number;
  textFontFamily?: string;
};

export const Custom3DButton = ({
  children,
  onPress,
  disabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  iconSize = CUSTOM_3D_BUTTON_DEFAULTS.iconSize,
  backgroundColor = CUSTOM_3D_BUTTON_DEFAULTS.backgroundColor,
  borderColor = CUSTOM_3D_BUTTON_DEFAULTS.borderColor,
  borderWidth = CUSTOM_3D_BUTTON_DEFAULTS.borderWidth,
  borderRadius = CUSTOM_3D_BUTTON_DEFAULTS.borderRadius,
  raisedColor = CUSTOM_3D_BUTTON_DEFAULTS.raisedColor,
  shadowColor = CUSTOM_3D_BUTTON_DEFAULTS.shadowColor,
  raiseLevel = CUSTOM_3D_BUTTON_DEFAULTS.raiseLevel,
  height = CUSTOM_3D_BUTTON_DEFAULTS.height,
  width,
  stretch = true,
  textColor = CUSTOM_3D_BUTTON_DEFAULTS.textColor,
  textSize = CUSTOM_3D_BUTTON_DEFAULTS.textSize,
  textFontFamily = CUSTOM_3D_BUTTON_DEFAULTS.textFontFamily,
}: Custom3DButtonProps) => {
  const { tapGesture, contentAnimatedStyle, shadowAnimatedStyle } = useCustom3DButtonLogic({
    onPress,
    disabled,
    isLoading,
    raiseLevel,
  });

  const styles = custom3DButtonStyles({
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
    raisedColor,
    shadowColor,
    raiseLevel,
    height,
    width,
    stretch,
    textColor,
    textSize,
    textFontFamily,
    isDisabled: disabled,
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <View style={styles.container}>
        <Animated.View style={[styles.shadow, shadowAnimatedStyle]} />
        <View style={styles.bottomFace} />
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          <View style={styles.topFace}>
            {isLoading ? (
              <ActivityIndicator color={textColor} />
            ) : (
              <Fragment>
                {leftIcon && <CustomIcon name={leftIcon} size={iconSize} color={textColor} style={styles.leftIcon} />}
                {children && <CustomText text={children} style={styles.text} numberOfLines={1} ellipsizeMode="tail" />}
                {rightIcon && (
                  <CustomIcon name={rightIcon} size={iconSize} color={textColor} style={styles.rightIcon} />
                )}
              </Fragment>
            )}
          </View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
};
