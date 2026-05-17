import { ButtonType, CustomButtonMedium, CustomText, PlatformOS, blur } from '@/features/core/ui';
import { useDetailsBoxLogic } from '@/features/trips/ui/components/DetailsBox/DetailsBox.logic';
import { styles } from '@/features/trips/ui/components/DetailsBox/DetailsBox.style';
import { MainPlacesList } from '@/features/trips/ui/components/MainPlacesList/MainPlacesList';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import type { FC, RefObject } from 'react';
import { Platform, type StyleProp, View, type ViewStyle } from 'react-native';

type DetailsBoxProps = {
  location: string;
  tripId: string;
  tripStartDate: string;
  totalTrips: number;
  style?: StyleProp<ViewStyle>;
  blurTargetRef?: RefObject<View | null>;
};

export const DetailsBox: FC<DetailsBoxProps> = ({
  location,
  tripId,
  tripStartDate,
  totalTrips,
  style,
  blurTargetRef,
}) => {
  const { handlePress, dateLabel, handleShowAllTripsButton } = useDetailsBoxLogic(tripId, tripStartDate);

  const content = (
    <View style={styles.contentContainer}>
      <CustomText text={location} style={styles.location} numberOfLines={1} ellipsizeMode="tail" />

      <View style={styles.titleContainer}>
        <CustomText text={dateLabel} style={styles.date} numberOfLines={1} ellipsizeMode="tail" />
        <CustomButtonMedium
          title="MY_TRIP.TRIP_DETAILS"
          onPress={handlePress}
          buttonType={ButtonType.Primary}
          textStyle={styles.buttonsText}
          style={styles.titleButton}
        />
      </View>

      <View style={styles.footerContainer}>
        <MainPlacesList />

        {totalTrips > 0 && (
          <CustomButtonMedium
            title="MY_TRIP.SHOW_ALL_TRIPS"
            onPress={handleShowAllTripsButton}
            buttonType={ButtonType.Secondary}
            textStyle={styles.buttonsText}
            style={styles.footerButton}
          />
        )}
      </View>
    </View>
  );

  if (Platform.OS === PlatformOS.android) {
    return (
      <MaskedView style={[styles.androidWrapper, style]} maskElement={<View style={styles.mask} />}>
        <BlurView
          intensity={blur.high}
          style={styles.androidBlur}
          blurMethod="dimezisBlurView"
          blurTarget={blurTargetRef}
          tint="dark"
        >
          {content}
        </BlurView>
      </MaskedView>
    );
  }

  return (
    <BlurView intensity={blur.high} style={[styles.detailsContainer, style]} blurMethod="dimezisBlurView" tint="dark">
      {content}
    </BlurView>
  );
};
