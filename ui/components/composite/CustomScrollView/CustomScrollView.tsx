import type { FC, PropsWithChildren } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent, StyleProp, ViewStyle } from 'react-native';
import { ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useCustomScrollViewLogic } from './CustomScrollView.logic';
import { styles } from './CustomScrollView.style';

type CustomScrollViewProps = {
  isDarkThemed?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  childrenStyle?: StyleProp<ViewStyle>;
  resetScroll?: boolean;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle?: number;
};

const CustomScrollView: FC<PropsWithChildren<CustomScrollViewProps>> = ({
  style,
  contentContainerStyle,
  childrenStyle,
  children,
  resetScroll = false,
  onScroll,
  scrollEventThrottle,
}) => {
  const { scrollViewRef, scrollToTop, keyboardViewStyle } = useCustomScrollViewLogic(resetScroll);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={scrollToTop}
        style={[styles.basicScrollView, style]}
        automaticallyAdjustKeyboardInsets={true}
        contentContainerStyle={[styles.basicContentStyle, contentContainerStyle]}
        keyboardShouldPersistTaps={'never'}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
      >
        <View style={[styles.basicView, styles.childrenContainer, childrenStyle]}>{children}</View>
      </ScrollView>
      <Animated.View style={keyboardViewStyle} />
    </View>
  );
};

export default CustomScrollView;
