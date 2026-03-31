import { navigationService } from '@/features/core/navigation';
import type { ScheduleItem } from '@/modules/trips/domain/dto/UserTripsDTO';
import { useGooglePlaceImagesQuery } from '@/ui/queries/googlePlaceImages/query/useGooglePlaceImagesQuery';
import { useTranslation } from 'react-i18next';

export const useActivityItemLogic = (scheduleItem: ScheduleItem, location: string, tripId: string) => {
  const imageLocationName = `${scheduleItem?.placeName}, ${location}`;

  const { data: imageData, isLoading: isImageLoading } = useGooglePlaceImagesQuery(imageLocationName, 400);

  const { t } = useTranslation();

  const handlePress = () => {
    navigationService.toActivityDetails({ tripId, activityId: scheduleItem.placeNumberID });
  };

  return {
    image: imageData,
    isLoading: isImageLoading,
    t,
    handlePress,
  };
};
