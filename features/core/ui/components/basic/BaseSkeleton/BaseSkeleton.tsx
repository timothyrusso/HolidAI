import { useBaseSkeletonLogic } from '@/features/core/ui/components/basic/BaseSkeleton/BaseSkeleton.logic';
import type { ReactElement } from 'react';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

export type BaseSkeletonProps = ViewProps & {
  children?: ReactElement;
  style?: StyleProp<ViewStyle>;
};

export const BaseSkeleton = ({ children, style, ...props }: BaseSkeletonProps) => {
  const { animatedStyle } = useBaseSkeletonLogic();

  return (
    <Animated.View style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
};
