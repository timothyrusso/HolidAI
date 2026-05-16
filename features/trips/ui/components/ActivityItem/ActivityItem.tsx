import { BaseSkeleton, CustomIcon, CustomImage, CustomText, colors, icons, spacing } from '@/features/core/ui';
import type { ScheduleItem } from '@/features/trips/domain/entities/ScheduleItem';
import { useActivityItemLogic } from '@/features/trips/ui/components/ActivityItem/ActivityItem.logic';
import { styles } from '@/features/trips/ui/components/ActivityItem/ActivityItem.style';
import { NumberedMarker } from '@/features/trips/ui/components/NumberedMarker/NumberedMarker';
import { type FC, Fragment, memo } from 'react';
import { Pressable, View } from 'react-native';

type ActivityItemProps = {
  scheduleItem: ScheduleItem;
  day: number;
  location: string;
  tripId: string;
  currency: string;
};

export const ActivityItem: FC<ActivityItemProps> = memo(
  ({ scheduleItem, day, location, tripId, currency }) => {
    const { image, isLoading, t, handlePress } = useActivityItemLogic(scheduleItem, location, tripId);

    return (
      <Pressable style={({ pressed }) => [styles.container, pressed && styles.pressed]} onPress={handlePress}>
        <NumberedMarker number={scheduleItem.placeNumberID} style={styles.marker} />
        <View style={styles.innerContainer}>
          {isLoading ? (
            <BaseSkeleton style={styles.skeleton} />
          ) : (
            <Fragment>
              <CustomImage source={typeof image === 'string' ? { uri: image } : image} style={styles.image} />
              <CustomText text={`${t('MY_TRIP.DAY')} ${day}`} style={styles.day} />
            </Fragment>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <View style={styles.timeContainer}>
              <CustomIcon name={icons.clock} size={spacing.Fourfold} color={colors.primaryBlack} />
              <CustomText
                text={scheduleItem.bestTimeToVisit}
                style={styles.time}
                numberOfLines={1}
                ellipsizeMode="tail"
              />
            </View>
            <View style={styles.ratingContainer}>
              <CustomText text={scheduleItem.rating.toString()} style={styles.rating} />
              <CustomIcon
                name={icons.star}
                size={spacing.Double + spacing.MinimalDouble}
                color={colors.primaryBlack}
                style={styles.star}
              />
            </View>
          </View>
          <CustomText text={scheduleItem.placeName} style={styles.place} />
          <CustomText text={scheduleItem.placeDetails} style={styles.description} />
          {scheduleItem.ticketPricing !== null && (
            <View style={styles.priceContainer}>
              <CustomIcon name={icons.card} size={spacing.Fourfold} color={colors.primaryBlack} />
              <CustomText
                text={
                  scheduleItem.ticketPricing === 0
                    ? t('ACTIVITY_DETAILS.FREE')
                    : `${scheduleItem.ticketPricing} ${currency}`
                }
                style={styles.price}
              />
            </View>
          )}
        </View>
      </Pressable>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.tripId === nextProps.tripId;
  },
);
