import { useGetGooglePlaceImage } from '@/features/core/images';
import { navigationService } from '@/features/core/navigation';
import type { ScheduleItem } from '@/features/trips/domain/entities/ScheduleItem';

import { useTranslation } from 'react-i18next';

export const useActivityItemLogic = (scheduleItem: ScheduleItem, location: string, tripId: string) => {
  const imageLocationName = `${scheduleItem.placeName}, ${location}`;

  const { data: imageResult, isLoading: isImageLoading } = useGetGooglePlaceImage(imageLocationName, 500);

  const { t } = useTranslation();

  const handlePress = () => {
    navigationService.toActivityDetails({ tripId, activityId: scheduleItem.placeNumberID });
  };

  return {
    image: imageResult?.url,
    isLoading: isImageLoading,
    t,
    handlePress,
  };
};
