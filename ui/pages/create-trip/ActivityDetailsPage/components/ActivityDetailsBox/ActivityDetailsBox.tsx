import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { icons } from '@/ui/constants/style/icons';
import { type FC, Fragment } from 'react';
import { View } from 'react-native';
import { styles } from './ActivityDetailsBox.style';

type ActivityDetailsBoxProps = {
  rating?: number;
  bestTimeToVisit?: string;
  ticketPricing?: string;
};

export const ActivityDetailsBox: FC<ActivityDetailsBoxProps> = ({ rating, bestTimeToVisit, ticketPricing }) => {
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
            <CustomText text={ticketPricing} style={styles.ticketPricingValue} />
          </View>
          <View style={styles.priceAlertContainer}>
            <CustomIcon name={icons.info} size={spacing.Triple} color={colors.primaryBlack} />
            <CustomText text="ACTIVITY_DETAILS.PRICE_ALERT" style={styles.priceAlert} />
          </View>
        </Fragment>
      )}
    </View>
  );
};
