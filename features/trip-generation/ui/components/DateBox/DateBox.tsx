import { style } from '@/features/trip-generation/ui/components/DateBox/DateBox.style';
import { ButtonType } from '@/ui/components/basic/CustomButton/CustomButton.logic';
import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import { CustomIconButtonMedium } from '@/ui/components/basic/CustomIconButton/CustomIconButtonMedium';
import { CustomText } from '@/ui/components/basic/CustomText/CustomText';
import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { icons } from '@/ui/style/icons';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

type DateBoxProps = {
  startDateLabel: string;
  endDateLabel: string;
  onClearDates: () => void;
};

export const DateBox: FC<DateBoxProps> = ({ startDateLabel, endDateLabel, onClearDates }) => {
  const { t } = useTranslation();

  return (
    <View style={style.dateLabelContainer}>
      <View style={style.rowLabelContainer}>
        <View style={style.labelContainer}>
          <CustomIcon name={icons.calendar} size={spacing.Triple} color={colors.primaryBlack} />
          <CustomText text="SELECT_DATES.START_DATE" style={style.dateLabel} />
        </View>
        <CustomText text={startDateLabel} style={style.dateValue} />
      </View>
      <View style={style.rowLabelContainer}>
        <View style={style.labelContainer}>
          <CustomIcon name={icons.airplane} size={spacing.Triple} color={colors.primaryBlack} style={style.icon} />
          <CustomText text="SELECT_DATES.END_DATE" style={style.dateLabel} />
        </View>
        <CustomText text={endDateLabel || startDateLabel} style={style.dateValue} />
      </View>
      {startDateLabel && !endDateLabel && (
        <View style={style.singleDayLabelContainer}>
          <CustomText text="SELECT_DATES.SINGLE_DAY" style={style.singleDayLabel} />
        </View>
      )}
      {startDateLabel && (
        <CustomIconButtonMedium
          iconName={icons.close}
          buttonType={ButtonType.Secondary}
          iconSize={spacing.Fourfold}
          style={style.removeDateButton}
          onPress={onClearDates}
          accessibilityRole="button"
          accessibilityLabel={t('SELECT_DATES.CLEAR_DATES')}
        />
      )}
    </View>
  );
};
