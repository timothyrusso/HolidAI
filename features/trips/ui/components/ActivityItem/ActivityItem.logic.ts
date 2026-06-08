import { buildPlacePhotoUrlUseCase } from '@/features/core/images';
import { navigationService } from '@/features/core/navigation';
import type { ScheduleItem } from '@/features/trips/domain/entities/ScheduleItem';
import { useTranslation } from 'react-i18next';

export const useActivityItemLogic = (scheduleItem: ScheduleItem, tripId: string) => {
  const { t } = useTranslation();

  const handlePress = () => {
    navigationService.toActivityDetails({ tripId, activityId: scheduleItem.placeNumberID });
  };

  const resourceName = scheduleItem.photoResourceNames?.[0];

  return {
    image: resourceName ? buildPlacePhotoUrlUseCase.execute(resourceName, 500) : undefined,
    t,
    handlePress,
  };
};
