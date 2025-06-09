import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { colors } from '@/ui/constants/style/colors';
import Slider from '@react-native-community/slider';
import { View } from 'react-native';
import { useTravelersNumberSliderLogic } from './TravelersNumberSlider.logic';
import { style } from './TravelersNumberSlider.style';

export const TravelersNumberSlider = () => {
  const { travelersNumber, handleSliderChange, MIN_SLIDER_VALUE, MAX_SLIDER_VALUE } = useTravelersNumberSliderLogic();

  return (
    <View style={style.container}>
      <View style={style.titleContainer}>
        <CustomText text="SELECT_TRAVELERS.TRAVELERS_NUMBER" style={style.title} />
        <CustomText text={travelersNumber.toString()} style={style.subtitle} />
      </View>
      <Slider
        style={style.slider}
        minimumValue={MIN_SLIDER_VALUE}
        maximumValue={MAX_SLIDER_VALUE}
        minimumTrackTintColor={colors.primaryBlack}
        maximumTrackTintColor={colors.primaryBlack}
        thumbTintColor={colors.primary}
        value={travelersNumber}
        onValueChange={handleSliderChange}
        step={1}
      />
    </View>
  );
};
