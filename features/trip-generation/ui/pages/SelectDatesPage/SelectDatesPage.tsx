import { Routes } from '@/features/core/navigation';
import { BasicView, CustomScrollView, CustomText, colors } from '@/features/core/ui';
import { DateBox } from '@/features/trip-generation/ui/components/DateBox/DateBox';
import { useSelectDatesPageLogic } from '@/features/trip-generation/ui/pages/SelectDatesPage/SelectDatesPage.logic';
import { style } from '@/features/trip-generation/ui/pages/SelectDatesPage/SelectDatesPage.style';
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
