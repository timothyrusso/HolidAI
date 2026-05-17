import { CustomIcon, CustomText, colors, icons, spacing } from '@/features/core/ui';
import { styles } from '@/features/trips/ui/components/ActivityDetailsBox/ActivityDetailsBox.style';
import { OpenMapButton } from '@/features/trips/ui/components/OpenMapButton/OpenMapButton';
import { type FC, Fragment } from 'react';
import { View } from 'react-native';
import { showLocation } from 'react-native-map-link';

type ActivityDetailsBoxProps = {
  locationTitle?: string;
  rating?: number;
  bestTimeToVisit?: string;
  ticketPricing?: number | null;
  currency?: string;
  latitude?: number;
  longitude?: number;
};

export const ActivityDetailsBox: FC<ActivityDetailsBoxProps> = ({
  rating,
  bestTimeToVisit,
  ticketPricing,
  currency,
  locationTitle,
  latitude,
  longitude,
}) => {
  return (
    <View style={styles.container}>
      {rating != null && (
        <View style={styles.ratingContainer}>
          <View style={styles.ratingValueContainer}>
            <CustomText text={rating.toString()} style={styles.ratingText} />
            <CustomIcon
              name={icons.star}
              size={spacing.Triple}
              color={colors.primaryYellow}
              style={styles.ratingIcon}
            />
          </View>
        </View>
      )}
      {bestTimeToVisit && (
        <View style={styles.bestTimeToVisitContainer}>
          <CustomText text="ACTIVITY_DETAILS.BEST_TIME_TO_VISIT" style={styles.bestTimeToVisitTitle} />
          <CustomText text={bestTimeToVisit} style={styles.bestTimeToVisitValue} />
        </View>
      )}
      {ticketPricing != null && (
        <Fragment>
          <View style={styles.ticketPricingContainer}>
            <CustomText text="ACTIVITY_DETAILS.TICKET_PRICING" style={styles.ticketPricingTitle} />
            <CustomText
              text={ticketPricing === 0 ? 'ACTIVITY_DETAILS.FREE' : `${ticketPricing} ${currency}`}
              style={styles.ticketPricingValue}
            />
          </View>
          <View style={styles.priceAlertContainer}>
            <CustomIcon name={icons.info} size={spacing.Triple} color={colors.primaryBlack} />
            <CustomText text="ACTIVITY_DETAILS.PRICE_ALERT" style={styles.priceAlert} />
          </View>
        </Fragment>
      )}
      {latitude != null && longitude != null && locationTitle && (
        <OpenMapButton
          onPress={() =>
            showLocation({
              latitude,
              longitude,
              title: locationTitle,
            })
          }
          style={styles.mapLink}
        />
      )}
    </View>
  );
};
