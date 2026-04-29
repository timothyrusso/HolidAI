import { Routes } from '@/features/core/navigation';
import { useSelectDatesPageLogic } from '@/features/trip-generation/ui/pages/SelectDatesPage/SelectDatesPage.logic';
import { style } from '@/features/trip-generation/ui/pages/SelectDatesPage/SelectDatesPage.style';
import { DateBox } from '@/features/trips/ui/components/DateBox/DateBox';
import { CustomText } from '@/ui/components/basic/CustomText/CustomText';
import { CustomScrollView } from '@/ui/components/composite/CustomScrollView/CustomScrollView';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { colors } from '@/ui/style/colors';
import { View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

export const SelectDatesPage = () => {
  const {
    handleButtonPress,
    todayInLocalTimezone,
    handleDateChange,
    startDate,
    numberOfDays,
    startDateLabel,
    endDateLabel,
    removeDates,
    calendarKey,
    userTokens,
  } = useSelectDatesPageLogic();

  return (
    <BasicView
      nameView={Routes.SelectDates}
      statusBarStyle="dark"
      bottomButtonTitle="SELECT_BUDGET.TITLE"
      bottomButtonPress={handleButtonPress}
      bottomButtonDisabled={!startDate}
      viewStyle={style.container}
    >
      <CustomScrollView contentContainerStyle={style.contentScrollViewContainer}>
        <CustomText text="SELECT_DATES.DESCRIPTION" style={style.subtitle} />
        <View style={style.calendar}>
          <CalendarPicker
            allowRangeSelection
            minDate={todayInLocalTimezone}
            maxRangeDuration={userTokens - 1}
            textStyle={style.calendarText}
            selectedDayColor={colors.primaryBlack}
            selectedDayTextStyle={style.calendarDayText}
            onDateChange={handleDateChange}
            selectedRangeStartStyle={numberOfDays !== 1 ? style.rangeSelection : null}
            key={calendarKey}
          />
        </View>
        {startDateLabel && (
          <DateBox startDateLabel={startDateLabel} endDateLabel={endDateLabel} onClearDates={removeDates} />
        )}
      </CustomScrollView>
    </BasicView>
  );
};
