import { ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomButtonMedium } from '@/ui/components/basic/CustomButton/CustomButtonMedium';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { blur } from '@/ui/style/blur';
import { BlurView } from 'expo-blur';
import type { FC } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';
import { MainPlacesList } from '../MainPlacesList/MainPlacesList';
import { useDetailsBoxLogic } from './DetailsBox.logic';
import { styles } from './DetailsBox.style';

type DetailsBoxProps = {
  location: string;
  tripId: string;
  tripStartDate: string;
  totalTrips: number;
  style?: StyleProp<ViewStyle>;
};

export const DetailsBox: FC<DetailsBoxProps> = ({ location, tripId, tripStartDate, totalTrips, style }) => {
  const { handlePress, dateLabel, handleShowAllTripsButton } = useDetailsBoxLogic(tripId, tripStartDate);

  return (
    <BlurView
      intensity={blur.default}
      style={[styles.detailsContainer, style]}
      experimentalBlurMethod="dimezisBlurView"
      tint="dark"
    >
      <View style={styles.labelContainer}>
        <CustomText text={'MY_TRIP.UPCOMING_TRIP'} style={styles.title} />
        <CustomText text={location} style={styles.location} numberOfLines={1} ellipsizeMode="tail" />
        <CustomText text={dateLabel} style={styles.date} />
      </View>
      <View style={styles.buttonsContainer}>
        <CustomButtonMedium
          title="MY_TRIP.TRIP_DETAILS"
          onPress={handlePress}
          buttonType={ButtonType.Primary}
          textStyle={styles.buttonsText}
        />
        <MainPlacesList />
        {totalTrips > 0 && (
          <CustomButtonMedium
            title="MY_TRIP.SHOW_ALL_TRIPS"
            onPress={handleShowAllTripsButton}
            buttonType={ButtonType.Secondary}
            textStyle={styles.buttonsText}
          />
        )}
      </View>
    </BlurView>
  );
};
