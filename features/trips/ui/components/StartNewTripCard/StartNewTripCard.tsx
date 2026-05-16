import { CustomButtonLarge, CustomIcon, CustomText, colors, icons, spacing } from '@/features/core/ui';
import { useStartNewTripCardLogic } from '@/features/trips/ui/components/StartNewTripCard/StartNewTripCard.logic';
import { style } from '@/features/trips/ui/components/StartNewTripCard/StartNewTripCard.style';
import { View } from 'react-native';

export const StartNewTripCard = () => {
  const { handleStartNewTrip } = useStartNewTripCardLogic();

  return (
    <View style={style.container}>
      <CustomIcon name={icons.location} size={spacing.Quintuple} color={colors.primaryBlack} accessible={false} />
      <CustomText text="MY_TRIP.NO_TRIPS_PLANNED" style={style.title} />
      <CustomButtonLarge title="MY_TRIP.START_NEW_TRIP" onPress={handleStartNewTrip} style={style.button} />
    </View>
  );
};
