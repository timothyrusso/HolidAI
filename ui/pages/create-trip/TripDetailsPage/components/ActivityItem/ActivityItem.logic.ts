import type { ScheduleItem } from '@/modules/trip/domain/dto/UserTripsDTO';
import { Routes, Stacks } from '@/ui/constants/navigation/routes';
import { useGooglePlaceImagesQuery } from '@/ui/queries/googlePlaceImages/query/useGooglePlaceImagesQuery';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export const useActivityItemLogic = (scheduleItem: ScheduleItem, location: string, tripId: string) => {
  const router = useRouter();
  const imageLocationName = `${scheduleItem?.placeName}, ${location}`;

  const { data: imageData, isLoading: isImageLoading } = useGooglePlaceImagesQuery(imageLocationName, 400);

  const { t } = useTranslation();

  const handlePress = () => {
    router.push({
      pathname: `/${Stacks.CreateTrip}/${Routes.ActivityDetails}`,
      params: { tripId, activityId: scheduleItem.placeNumberID },
    });
  };

  return {
    image: imageData,
    isLoading: isImageLoading,
    t,
    handlePress,
  };
};
