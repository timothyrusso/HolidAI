import type { PropsWithChildren } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { CustomButtonLarge } from '../../basic/CustomButton/CustomButtonLarge';
import { useBasicViewLogic } from './BasicView.logic';

export type BasicViewProps = {
  isFullScreen?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  viewStyle?: StyleProp<ViewStyle>;
  nameView: string;
  bottomButtonTitle?: string;
  bottomButtonPress?: () => void;
  bottomButtonDisabled?: boolean;
  bottomButtonLoading?: boolean;
  topGradientColor?: string;
  bottomGradientColor?: string;
  isMenuVisible?: boolean;
  statusBarStyle?: 'light' | 'dark';
  hasHeader?: boolean;
};

export const BasicView = (props: PropsWithChildren<BasicViewProps>) => {
  const {
    containerStyle,
    viewStyle,
    children,
    bottomButtonTitle,
    bottomButtonPress,
    bottomButtonDisabled,
    bottomButtonLoading,
    topGradientColor,
    bottomGradientColor,
    isFullScreen = false,
    statusBarStyle = 'light',
  } = props;

  const { componentStyle } = useBasicViewLogic(props);

  const Container = isFullScreen ? View : SafeAreaView;

  return (
    <Container style={[componentStyle.containerViewStyle, componentStyle.basicContainer, containerStyle]}>
      <StatusBar translucent={true} style={statusBarStyle} />
      <View style={[componentStyle.containerViewStyle, viewStyle]}>
        {topGradientColor && bottomGradientColor && (
          <LinearGradient
            colors={[topGradientColor, bottomGradientColor]}
            style={componentStyle.gradient}
            locations={[0.5, 0.5]}
          />
        )}
        {children}
        {bottomButtonTitle && bottomButtonPress && (
          <View style={componentStyle.buttonContainer}>
            <CustomButtonLarge
              title={bottomButtonTitle}
              onPress={bottomButtonPress}
              isDisabled={bottomButtonDisabled}
              isLoading={bottomButtonLoading}
            />
          </View>
        )}
      </View>
    </Container>
  );
};
