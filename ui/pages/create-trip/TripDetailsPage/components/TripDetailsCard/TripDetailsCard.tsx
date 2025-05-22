import type { TripDetails } from '@/modules/trip/domain/dto/UserTripsDTO';
import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { icons } from '@/ui/constants/style/icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { styles } from './TripDetailsCard.style';

type TripDetailsCardProps = {
  tripDetails: Omit<TripDetails, 'locale' | 'location'>;
};

export const TripDetailsCard: FC<TripDetailsCardProps> = ({ tripDetails }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.gradient}
          start={{ x: 0.1, y: 0.2 }}
          end={{ x: 0.9, y: 0.8 }}
        />
        <CustomText text="MY_TRIP.TRIP_DETAILS" style={styles.headerText} />
        <View style={styles.headerChipContainer}>
          {tripDetails.durationNights > 0 ? (
            <CustomText
              text={`${tripDetails.durationDays} ${t('MY_TRIP.DAYS', { count: tripDetails.durationDays })} / ${tripDetails.durationNights} ${t('MY_TRIP.NIGHT', { count: tripDetails.durationNights })}`}
              style={styles.headerChipText}
            />
          ) : (
            <CustomText text={`${tripDetails.durationDays} ${t('MY_TRIP.DAYS')}`} style={styles.headerChipText} />
          )}
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.subtitleContainer}>
          <CustomIcon name={icons.calendar} size={spacing.Triple} color={colors.secondaryBlue} />
          <CustomText text="MY_TRIP.TRAVEL_DATES" style={styles.subtitle} />
        </View>
        {tripDetails.startDate && tripDetails.endDate ? (
          <CustomText text={`${tripDetails.startDate} - ${tripDetails.endDate}`} style={styles.contentValue} />
        ) : (
          <CustomText text={tripDetails.startDate} style={styles.contentValue} />
        )}
        <View style={styles.rowContainer}>
          <View style={styles.columnContainer}>
            <View style={styles.subtitleContainer}>
              <CustomIcon name={icons.people} size={spacing.Triple} color={colors.secondaryBlue} />
              <CustomText text="MY_TRIP.TRAVELERS" style={styles.subtitle} />
            </View>
            <CustomText text={tripDetails.travelers.toString()} style={styles.contentValue} />
          </View>
          <View style={styles.columnContainer}>
            <View style={styles.subtitleContainer}>
              <CustomIcon name={icons.card} size={spacing.Triple} color={colors.secondaryBlue} />
              <CustomText text="MY_TRIP.BUDGET" style={styles.subtitle} />
            </View>
            <CustomText text={tripDetails.budget} style={styles.budgetValue} />
          </View>
        </View>
      </View>
    </View>
  );
};
