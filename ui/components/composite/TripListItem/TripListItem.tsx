import type { TripAiResp, UserTripData } from '@/modules/trip/domain/dto/UserTripsDTO';
import { routes } from '@/ui/constants/routes';
import { useRouter } from 'expo-router';
import type { FC } from 'react';
import { Image, Pressable, View } from 'react-native';
import CustomText from '../../basic/CustomText/CustomText';
import { styles } from './TripListItem.style';

type TripListItemProps = {
  tripItem: TripAiResp & UserTripData & { image: string };
};

export const TripListItem: FC<TripListItemProps> = ({ tripItem }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push({ pathname: routes.tripDetails, params: { trip: JSON.stringify(tripItem) } })}
      style={({ pressed }) => [pressed ? { opacity: 0.5 } : {}]}
    >
      <View style={styles.container}>
        <Image
          source={{
            uri: tripItem.image,
          }}
          style={styles.image}
        />
        <CustomText style={styles.location} text={tripItem.location} numberOfLines={2} ellipsizeMode="tail" />

        <CustomText style={styles.days} text={`📆 ${tripItem.days}`} />

        <CustomText style={styles.budget} text={`💰 ${tripItem?.tripDetails?.budget}`} />

        <CustomText style={styles.travelers} text={`👥 ${tripItem.tripDetails?.travelers.toString()}`} />
      </View>
    </Pressable>
  );
};
