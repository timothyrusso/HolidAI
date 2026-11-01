import { useTranslation } from 'react-i18next';
import { IMAGE_RESOLUTION, usePlacePhotoUrls } from '@/features/core/images';
import { navigationService } from '@/features/core/navigation';
import type { ScheduleItem } from '@/features/trips/domain/entities/ScheduleItem';

export const useActivityItemLogic = (scheduleItem: ScheduleItem, tripId: string, currency: string) => {
  const { t } = useTranslation();

  const handlePress = () => {
    navigationService.toActivityDetails({ tripId, activityId: scheduleItem.placeNumberID });
  };

  const [image] = usePlacePhotoUrls((scheduleItem.photoResourceNames ?? []).slice(0, 1), IMAGE_RESOLUTION.medium);

  const priceLabel =
    scheduleItem.ticketPricing === null
      ? null
      : scheduleItem.ticketPricing === 0
        ? t('ACTIVITY_DETAILS.FREE')
        : `${scheduleItem.ticketPricing} ${currency}`;

  return {
    state: {
      t,
      placeNumberID: scheduleItem.placeNumberID,
      placeName: scheduleItem.placeName,
      bestTimeToVisit: scheduleItem.bestTimeToVisit,
      placeDetails: scheduleItem.placeDetails,
    },
    derived: {
      image,
      rating: scheduleItem.rating.toString(),
      priceLabel,
    },
    effects: {
      handlePress,
    },
  };
};
