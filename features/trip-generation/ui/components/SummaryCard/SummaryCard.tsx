import { CustomIcon, CustomText, colors, icons, spacing } from '@/features/core/ui';
import type { TravelerInfo } from '@/features/trip-generation/domain/entities/TravelerInfo';
import { style } from '@/features/trip-generation/ui/components/SummaryCard/SummaryCard.style';
import type { FC } from 'react';
import { View } from 'react-native';

type SummaryCardProps = {
  destination: string;
  dates: string;
  travelers: TravelerInfo;
  budget: string;
};

export const SummaryCard: FC<SummaryCardProps> = ({ destination, dates, travelers, budget }) => {
  return (
    <View style={style.container}>
      <View style={style.itemRow}>
        <View style={style.title}>
          <CustomIcon name={icons.locationOutline} size={spacing.Fourfold} color={colors.primaryBlack} />
          <CustomText text="REVIEW_TRIP.DESTINATION" style={style.label} />
        </View>
        <CustomText text={destination} style={style.destination} />
      </View>
      <View style={style.itemRow}>
        <View style={style.title}>
          <CustomIcon name={icons.calendarOutline} size={spacing.Fourfold} color={colors.primaryBlack} />
          <CustomText text="REVIEW_TRIP.TRAVEL_DATE" style={style.label} />
        </View>
        <CustomText text={dates} style={style.value} />
      </View>
      <View style={style.itemRow}>
        <View style={style.title}>
          <CustomIcon name={icons.people} size={spacing.Fourfold} color={colors.primaryBlack} />
          <CustomText text="REVIEW_TRIP.TRAVELERS" style={style.label} />
        </View>
        <CustomText text={travelers.travelersNumber.toString()} style={style.value} />
      </View>
      <View style={style.itemRow}>
        <View style={style.title}>
          <CustomIcon name={icons.people} size={spacing.Fourfold} color={colors.primaryBlack} />
          <CustomText text="REVIEW_TRIP.TRAVELERS_TYPE" style={style.label} />
        </View>
        <CustomText text={travelers.travelersType} style={style.value} />
      </View>
      <View style={style.itemRow}>
        <View style={style.title}>
          <CustomIcon name={icons.card} size={spacing.Fourfold} color={colors.primaryBlack} />
          <CustomText text="REVIEW_TRIP.BUDGET" style={style.label} />
        </View>
        <CustomText text={budget} style={style.value} />
      </View>
    </View>
  );
};
