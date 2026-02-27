import { CustomIcon } from '@/ui/components/basic/CustomIcon/CustomIcon';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { blur } from '@/ui/style/blur';
import { colors } from '@/ui/style/colors';
import { spacing } from '@/ui/style/dimensions/spacing';
import { icons } from '@/ui/style/icons';
import { BlurView } from 'expo-blur';
import { Pressable, View } from 'react-native';
import { useHomeCustomHeaderLogic } from './HomeCustomHeader.logic';

export const HomeCustomHeader = () => {
  const { styles, handleShowAllTrips } = useHomeCustomHeaderLogic();

  return (
    <View style={styles.container}>
      <Pressable onPress={handleShowAllTrips} style={({ pressed }) => pressed && styles.pressed}>
        <BlurView
          intensity={blur.medium}
          style={styles.showAllTripsContainer}
          experimentalBlurMethod="dimezisBlurView"
          tint="dark"
        >
          <CustomText text="MY_TRIP.SHOW_ALL_TRIPS" style={styles.showAllTripsText} />
          <CustomIcon name={icons.list} size={spacing.TripleAndHalf} color={colors.primaryWhite} />
        </BlurView>
      </Pressable>
    </View>
  );
};
