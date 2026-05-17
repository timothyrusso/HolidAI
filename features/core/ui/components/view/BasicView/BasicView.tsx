import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CustomButtonLarge } from '@/features/core/ui/components/basic/CustomButton/CustomButtonLarge';
import type { BasicViewProps } from '@/features/core/ui/components/view/BasicView/BasicView.logic';
import { useBasicViewLogic } from '@/features/core/ui/components/view/BasicView/BasicView.logic';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

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
    hasHeader = true,
  } = props;

  const { componentStyle } = useBasicViewLogic(props);

  const Container = isFullScreen || hasHeader ? View : SafeAreaView;

  return (
    <Container style={[componentStyle.containerViewStyle, componentStyle.basicContainer, containerStyle]}>
      <StatusBar style={statusBarStyle} />
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
