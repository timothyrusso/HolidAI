import { Routes, Stacks } from '@/modules/navigation/domain/entities/routes';
import { CustomButtonLarge } from '@/ui/components/basic/CustomButton/CustomButtonLarge';
import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { icons } from '@/ui/style/icons';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { style } from './StartNewTripCard.style';

const StartNewTripCard = () => {
  const router = useRouter();

  return (
    <View style={style.container}>
      <CustomIcon name={icons.location} size={spacing.Quintuple} color={colors.primaryBlack} />
      <CustomText text="MY_TRIP.NO_TRIPS_PLANNED" style={style.title} />
      <CustomButtonLarge
        title="MY_TRIP.START_NEW_TRIP"
        onPress={() => router.push(`/${Stacks.CreateTrip}/${Routes.Search}`)}
        style={style.button}
      />
    </View>
  );
};

export default StartNewTripCard;
