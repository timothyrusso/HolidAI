import type { Weather } from '@/modules/trips/domain/dto/UserTripsDTO';
import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { icons } from '@/ui/style/icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { FC } from 'react';
import { View } from 'react-native';
import { styles } from './WeatherCard.style';

type WeatherCardProps = {
  weather: Weather;
};

export const WeatherCard: FC<WeatherCardProps> = ({ weather }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LinearGradient
          colors={[colors.tertiaryBlue, colors.primaryBlue]}
          style={styles.gradient}
          start={{ x: 0.1, y: 0.2 }}
          end={{ x: 0.9, y: 0.8 }}
        />
        <CustomText text="MY_TRIP.WEATHER_INFORMATION" style={styles.headerText} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.subtitleContainer}>
          <CustomIcon name={icons.cloud} size={spacing.Triple} color={colors.secondaryBlue} />
          <CustomText text="MY_TRIP.GENERAL_CONDITIONS" style={styles.subtitle} />
        </View>
        <CustomText text={weather.weatherGeneralNotes} style={styles.contentValue} />
        <View style={styles.temperatureContainer}>
          <View style={styles.columnContainer}>
            <View style={styles.subtitleContainer}>
              <CustomIcon name={icons.thermometer} size={spacing.Triple} color={colors.primaryRed} />
              <CustomText text="MY_TRIP.HIGH_TEMPERATURE" style={styles.subtitle} />
            </View>
            <CustomText text={weather.averageHighTemperature} style={styles.contentValue} />
          </View>
          <View style={styles.columnContainer}>
            <View style={styles.subtitleContainer}>
              <CustomIcon name={icons.thermometer} size={spacing.Triple} color={colors.secondaryBlue} />
              <CustomText text="MY_TRIP.LOW_TEMPERATURE" style={styles.subtitle} />
            </View>
            <CustomText text={weather.averageLowTemperature} style={styles.contentValue} />
          </View>
        </View>
        <View style={styles.subtitleContainer}>
          <CustomIcon name={icons.clock} size={spacing.Triple} color={colors.secondaryYellow} />
          <CustomText text="MY_TRIP.DAYLIGHT_HOURS" style={styles.subtitle} />
        </View>
        <CustomText text={weather.daylight} style={styles.contentValue} />
        <View style={styles.horizontalSeparator} />
        <CustomText text="MY_TRIP.RECOMMENDATIONS" style={styles.title} />
        <View style={styles.subtitleContainer}>
          <CustomIcon name={icons.shirt} size={spacing.Triple} color={colors.primary} />
          <CustomText text="MY_TRIP.CLOTHING" style={styles.subtitle} />
        </View>
        <CustomText text={weather.weatherClothingNotes} style={styles.contentValue} />
        <View style={styles.subtitleContainer}>
          <CustomIcon name={icons.sun} size={spacing.Triple} color={colors.secondaryYellow} />
          <CustomText text="MY_TRIP.SUN_PROTECTION" style={styles.subtitle} />
        </View>
        <CustomText text={weather.weatherSunProtectionNotes} style={styles.contentValue} />
        <View style={styles.subtitleContainer}>
          <CustomIcon name={icons.umbrella} size={spacing.Triple} color={colors.secondaryBlue} />
          <CustomText text="MY_TRIP.RAIN_PREPAREDNESS" style={styles.subtitle} />
        </View>
        <CustomText text={weather.weatherRainPreparednessNotes} style={styles.contentValue} />
        <View style={styles.subtitleContainer}>
          <CustomIcon name={icons.walk} size={spacing.Triple} color={colors.primaryBlack} />
          <CustomText text="MY_TRIP.OUTDOOR_ACTIVITIES" style={styles.subtitle} />
        </View>
        <CustomText text={weather.weatherOutdoorActivitiesNotes} style={styles.contentValue} />
      </View>
    </View>
  );
};
