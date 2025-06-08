import { CustomButtonLarge } from '@/ui/components/basic/CustomButton/CustomButtonLarge';
import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { Routes, Stacks } from '@/ui/constants/navigation/routes';
import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { icons } from '@/ui/constants/style/icons';
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
