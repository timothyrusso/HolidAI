import CustomText from '@/ui/components/basic/CustomText/CustomText';
import CustomScrollView from '@/ui/components/composite/CustomScrollView/CustomScrollView';
import { BasicView } from '@/ui/components/view/BasicView/BasicView';
import { Routes } from '@/ui/constants/navigation/routes';
import { colors } from '@/ui/constants/style/colors';
import { View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { useSelectDatesPageLogic } from './SelectDatesPage.logic';
import { style } from './SelectDatesPage.style';
import { DateBox } from './components/DateBox/DateBox';

const SelectDatesPage = () => {
  const {
    handleButtonPress,
    todayInLocalTimezone,
    handleDateChange,
    startDate,
    numberOfDays,
    startDateLabel,
    endDateLabel,
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
            textStyle={style.calendarText}
            selectedDayColor={colors.primaryBlack}
            selectedDayTextStyle={style.calendarDayText}
            onDateChange={handleDateChange}
            selectedRangeStartStyle={numberOfDays !== 1 ? style.rangeSelection : null}
          />
        </View>
        {startDateLabel && <DateBox startDateLabel={startDateLabel} endDateLabel={endDateLabel} />}
      </CustomScrollView>
    </BasicView>
  );
};

export default SelectDatesPage;
