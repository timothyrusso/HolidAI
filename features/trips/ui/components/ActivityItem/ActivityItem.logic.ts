import { IMAGE_RESOLUTION, buildPlacePhotoUrlUseCase } from '@/features/core/images';
import { navigationService } from '@/features/core/navigation';
import type { ScheduleItem } from '@/features/trips/domain/entities/ScheduleItem';
import { useTranslation } from 'react-i18next';

export const useActivityItemLogic = (scheduleItem: ScheduleItem, tripId: string, currency: string) => {
  const { t } = useTranslation();

  const handlePress = () => {
    navigationService.toActivityDetails({ tripId, activityId: scheduleItem.placeNumberID });
  };

  const resourceName = scheduleItem.photoResourceNames?.[0];

  const priceLabel =
    scheduleItem.ticketPricing === null
      ? null
      : scheduleItem.ticketPricing === 0
        ? t('ACTIVITY_DETAILS.FREE')
        : `${scheduleItem.ticketPricing} ${currency}`;

  return {
    image: resourceName ? buildPlacePhotoUrlUseCase.execute(resourceName, IMAGE_RESOLUTION.medium) : undefined,
    t,
    handlePress,
    placeNumberID: scheduleItem.placeNumberID,
    placeName: scheduleItem.placeName,
    bestTimeToVisit: scheduleItem.bestTimeToVisit,
    rating: scheduleItem.rating.toString(),
    priceLabel,
    placeDetails: scheduleItem.placeDetails,
  };
};
