import { CustomIcon, CustomText, colors, icons, spacing } from '@/features/core/ui';
import type { TripDetails } from '@/features/trips/domain/entities/TripDetails';
import { useTripDetailsCard } from '@/features/trips/ui/components/TripDetailsCard/TripDetailsCard.logic';
import { styles } from '@/features/trips/ui/components/TripDetailsCard/TripDetailsCard.style';
import { LinearGradient } from 'expo-linear-gradient';
import type { FC } from 'react';
import { View } from 'react-native';

type TripDetailsCardProps = {
  tripDetails: Omit<TripDetails, 'locale' | 'location'>;
};

export const TripDetailsCard: FC<TripDetailsCardProps> = ({ tripDetails }) => {
  const { dateLabel, durationLabel, budgetColor } = useTripDetailsCard({ tripDetails });

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
          <CustomText text={durationLabel} style={styles.headerChipText} />
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.subtitleContainer}>
          <CustomIcon name={icons.calendar} size={spacing.Triple} color={colors.secondaryBlue} />
          <CustomText text="MY_TRIP.TRAVEL_DATES" style={styles.subtitle} />
        </View>
        {tripDetails.startDate && tripDetails.endDate ? (
          <CustomText text={dateLabel} style={styles.contentValue} />
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
            <CustomText text={tripDetails.budget} style={[styles.budgetValue, { backgroundColor: budgetColor }]} />
          </View>
        </View>
      </View>
    </View>
  );
};
