import { CustomIcon, type IoniconsName } from '@/ui/components/basic/CustomIcon/CustomIcon';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { icons } from '@/ui/constants/style/icons';
import { type FC, Fragment } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { style } from './ButtonsContainer.style';

type ButtonsContainerProps = {
  firstTitle: string;
  firstOnPress: () => void;
  firstIcon: IoniconsName;
  firstIsLoading?: boolean;
  secondTitle: string;
  secondOnPress: () => void;
  secondIcon: IoniconsName;
  secondIsLoading?: boolean;
  thirdTitle: string;
  thirdOnPress: () => void;
  thirdIcon: IoniconsName;
  thirdIsLoading?: boolean;
};

export const ButtonsContainer: FC<ButtonsContainerProps> = ({
  firstTitle,
  firstOnPress,
  firstIcon,
  firstIsLoading,
  secondTitle,
  secondOnPress,
  secondIcon,
  secondIsLoading,
  thirdTitle,
  thirdOnPress,
  thirdIcon,
  thirdIsLoading,
}) => {
  return (
    <View style={style.container}>
      <Pressable
        style={({ pressed }) => [style.button, pressed && style.pressed, firstIsLoading && style.isLoading]}
        onPress={firstIsLoading ? undefined : firstOnPress}
      >
        <View style={style.titleContainer}>
          <CustomIcon name={firstIcon} size={spacing.TripleAndHalf} color={colors.primaryBlack} />
          {firstIsLoading ? (
            <ActivityIndicator size="small" color={colors.primaryBlack} />
          ) : (
            <CustomText text={firstTitle} style={style.title} />
          )}
        </View>
        <CustomIcon name={icons.arrowRight} size={spacing.TripleAndHalf} color={colors.primaryBlack} />
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          style.button,
          style.topBorder,
          pressed && style.pressed,
          secondIsLoading && style.isLoading,
        ]}
        onPress={secondIsLoading ? undefined : secondOnPress}
      >
        <View style={style.titleContainer}>
          <CustomIcon name={secondIcon} size={spacing.TripleAndHalf} color={colors.primaryBlack} />
          {secondIsLoading ? (
            <ActivityIndicator size="small" color={colors.primaryBlack} />
          ) : (
            <CustomText text={secondTitle} style={style.title} />
          )}
        </View>
        <CustomIcon name={icons.arrowRight} size={spacing.TripleAndHalf} color={colors.primaryBlack} />
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          style.button,
          style.topBorder,
          pressed && style.pressed,
          thirdIsLoading && style.isLoading,
        ]}
        onPress={thirdIsLoading ? undefined : thirdOnPress}
      >
        {thirdIsLoading ? (
          <ActivityIndicator size="small" color={colors.primaryBlack} />
        ) : (
          <Fragment>
            <View style={style.titleContainer}>
              <CustomIcon name={thirdIcon} size={spacing.TripleAndHalf} color={colors.primaryBlack} />

              <CustomText text={thirdTitle} style={style.title} />
            </View>
            <CustomIcon name={icons.arrowRight} size={spacing.TripleAndHalf} color={colors.primaryBlack} />
          </Fragment>
        )}
      </Pressable>
    </View>
  );
};
