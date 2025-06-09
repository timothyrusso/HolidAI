import type { TravelerInfo } from '@/modules/trip/domain/entities/TravelerInfo';
import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { colors } from '@/ui/constants/style/colors';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import { icons } from '@/ui/constants/style/icons';
import type { FC } from 'react';
import { View } from 'react-native';
import { style } from './SummaryCard.style';

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
