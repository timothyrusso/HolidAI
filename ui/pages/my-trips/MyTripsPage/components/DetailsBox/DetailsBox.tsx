import { ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomButtonLarge } from '@/ui/components/basic/CustomButton/CustomButtonLarge';
import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { blur } from '@/ui/constants/style/blur';
import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { icons } from '@/ui/constants/style/icons';
import { BlurView } from 'expo-blur';
import type { FC } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';
import { MainPlacesList } from '../MainPlacesList/MainPlacesList';
import { useDetailsBoxLogic } from './DetailsBox.logic';
import { styles } from './DetailsBox.style';
type DetailsBoxProps = {
  location: string;
  days: number;
  budget: string;
  travelers: number;
  tripId: string;
  tripStartDate: string;
  style?: StyleProp<ViewStyle>;
};

export const DetailsBox: FC<DetailsBoxProps> = ({
  location,
  days,
  budget,
  travelers,
  tripId,
  tripStartDate,
  style,
}) => {
  const { handlePress, budgetLabel, travelersLabel, daysLabel, dateLabel } = useDetailsBoxLogic(
    tripId,
    tripStartDate,
    budget,
    travelers,
    days,
  );

  return (
    <BlurView
      intensity={blur.default}
      style={[styles.detailsContainer, style]}
      experimentalBlurMethod="dimezisBlurView"
      tint="dark"
    >
      <View style={styles.labelContainer}>
        <CustomText text={location} style={styles.location} />
      </View>
      <View style={styles.detailsBoxContainer}>
        <View style={styles.labelDetailsContainer}>
          <CustomIcon name={icons.calendar} size={spacing.TripleAndHalf} color={colors.primaryWhite} />
          <CustomText text={daysLabel.toString()} style={styles.label} />
        </View>
        <View style={styles.labelDetailsContainer}>
          <CustomIcon name={icons.card} size={spacing.TripleAndHalf} color={colors.primaryWhite} />
          <CustomText text={budgetLabel} style={styles.label} />
        </View>
        <View style={styles.labelDetailsContainer}>
          <CustomIcon name={icons.people} size={spacing.TripleAndHalf} color={colors.primaryWhite} />
          <CustomText text={travelersLabel.toString()} style={styles.label} />
        </View>
      </View>
      <CustomText text={dateLabel} style={styles.date} />
      <MainPlacesList />
      <CustomButtonLarge
        title="MY_TRIP.TRIP_DETAILS"
        onPress={handlePress}
        style={styles.detailsButton}
        buttonType={ButtonType.Main}
      />
    </BlurView>
  );
};
