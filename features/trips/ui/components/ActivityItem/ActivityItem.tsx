import { CustomIcon, CustomImage, CustomText, colors, icons, spacing } from '@/features/core/ui';
import type { ScheduleItem } from '@/features/trips/domain/entities/ScheduleItem';
import { useActivityItemLogic } from '@/features/trips/ui/components/ActivityItem/ActivityItem.logic';
import { styles } from '@/features/trips/ui/components/ActivityItem/ActivityItem.style';
import { NumberedMarker } from '@/features/trips/ui/components/NumberedMarker/NumberedMarker';
import { type FC, memo } from 'react';
import { Pressable, View } from 'react-native';

type ActivityItemProps = {
  scheduleItem: ScheduleItem;
  day: number;
  tripId: string;
  currency: string;
};

export const ActivityItem: FC<ActivityItemProps> = memo(
  ({ scheduleItem, day, tripId, currency }) => {
    const { image, t, handlePress, placeNumberID, placeName, bestTimeToVisit, rating, priceLabel, placeDetails } =
      useActivityItemLogic(scheduleItem, tripId, currency);

    return (
      <Pressable style={({ pressed }) => [styles.container, pressed && styles.pressed]} onPress={handlePress}>
        <NumberedMarker number={placeNumberID} style={styles.marker} />
        <View style={styles.innerContainer}>
          <CustomImage source={typeof image === 'string' ? { uri: image } : image} style={styles.image} />
          <CustomText text={`${t('MY_TRIP.DAY')} ${day}`} style={styles.day} />
        </View>
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <View style={styles.timeContainer}>
              <CustomIcon name={icons.clock} size={spacing.Fourfold} color={colors.primaryBlack} />
              <CustomText text={bestTimeToVisit} style={styles.time} numberOfLines={1} ellipsizeMode="tail" />
            </View>
            <View style={styles.ratingContainer}>
              <CustomText text={rating} style={styles.rating} />
              <CustomIcon
                name={icons.star}
                size={spacing.Double + spacing.MinimalDouble}
                color={colors.primaryBlack}
                style={styles.star}
              />
            </View>
          </View>
          <CustomText text={placeName} style={styles.place} />
          <CustomText text={placeDetails} style={styles.description} />
          {priceLabel !== null && (
            <View style={styles.priceContainer}>
              <CustomIcon name={icons.card} size={spacing.Fourfold} color={colors.primaryBlack} />
              <CustomText text={priceLabel} style={styles.price} />
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
