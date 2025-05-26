import type { ScheduleItem } from '@/modules/trip/domain/dto/UserTripsDTO';
import { BaseSkeleton } from '@/ui/components/basic/BaseSkeleton/BaseSkeleton';
import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { icons } from '@/ui/constants/style/icons';
import { type FC, Fragment, memo } from 'react';
import { Image, Pressable, View } from 'react-native';
import { NumberedMarker } from '../NumberedMarker/NumberedMarker';
import { useActivityItemLogic } from './ActivityItem.logic';
import { styles } from './ActivityItem.style';

type ActivityItemProps = {
  scheduleItem: ScheduleItem;
  day: number;
  location: string;
  tripId: string;
};

export const ActivityItem: FC<ActivityItemProps> = memo(
  ({ scheduleItem, day, location, tripId }) => {
    const { image, isLoading, t, handlePress } = useActivityItemLogic(scheduleItem, location, tripId);

    return (
      <Pressable style={({ pressed }) => [styles.container, pressed && styles.pressed]} onPress={handlePress}>
        {isLoading ? (
          <BaseSkeleton style={styles.skeleton} />
        ) : (
          <Fragment>
            <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.image} />
            <CustomText text={`${t('MY_TRIP.DAY')} ${day}`} style={styles.day} />
            <NumberedMarker number={scheduleItem.placeNumberID} style={styles.marker} />
          </Fragment>
        )}

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
          <CustomText text={scheduleItem.activity} style={styles.place} />
          <CustomText text={scheduleItem.placeDetails} style={styles.description} />
          <View style={styles.priceContainer}>
            <CustomIcon name={icons.card} size={spacing.Fourfold} color={colors.primaryBlack} />
            <CustomText
              text={`${scheduleItem.ticketPricing}${Number(scheduleItem.ticketPricing.toString()) > 0 ? '$' : ''}`}
              style={styles.price}
            />
          </View>
        </View>
      </Pressable>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.tripId === nextProps.tripId;
  },
);
