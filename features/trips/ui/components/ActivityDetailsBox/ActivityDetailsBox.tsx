import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { icons } from '@/ui/style/icons';
import { type FC, Fragment } from 'react';
import { View } from 'react-native';
import { showLocation } from 'react-native-map-link';
import { OpenMapButton } from '../OpenMapButton/OpenMapButton';
import { styles } from './ActivityDetailsBox.style';

type ActivityDetailsBoxProps = {
  locationTitle?: string;
  rating?: number;
  bestTimeToVisit?: string;
  ticketPricing?: string;
  latitude?: number;
  longitude?: number;
};

export const ActivityDetailsBox: FC<ActivityDetailsBoxProps> = ({
  rating,
  bestTimeToVisit,
  ticketPricing,
  locationTitle,
  latitude,
  longitude,
}) => {
  return (
    <View style={styles.container}>
      {rating && (
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
      {ticketPricing && (
        <Fragment>
          <View style={styles.ticketPricingContainer}>
            <CustomText text="ACTIVITY_DETAILS.TICKET_PRICING" style={styles.ticketPricingTitle} />
            <CustomText
              text={`${ticketPricing}${Number(ticketPricing.toString()) > 0 ? '$' : ''}`}
              style={styles.ticketPricingValue}
            />
          </View>
          <View style={styles.priceAlertContainer}>
            <CustomIcon name={icons.info} size={spacing.Triple} color={colors.primaryBlack} />
            <CustomText text="ACTIVITY_DETAILS.PRICE_ALERT" style={styles.priceAlert} />
          </View>
        </Fragment>
      )}
      {latitude && longitude && locationTitle && (
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
