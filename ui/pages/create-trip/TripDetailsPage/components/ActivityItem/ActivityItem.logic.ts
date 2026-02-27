import { Routes, Stacks } from '@/modules/navigation/domain/entities/routes';
import type { ScheduleItem } from '@/modules/trips/domain/dto/UserTripsDTO';
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
