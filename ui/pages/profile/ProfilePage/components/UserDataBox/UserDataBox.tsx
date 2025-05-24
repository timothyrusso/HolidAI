import type { UserTrips } from '@/modules/trip/domain/dto/UserTripsDTO';
import CustomText from '@/ui/components/basic/CustomText/CustomText';
import { Fragment } from 'react';
import { Pressable, View } from 'react-native';
import { styles } from './UserDataBox.style';

type UserDataBoxProps = {
  totalTrips: number;
  favoriteTrips: UserTrips[];
  onPress: () => void;
};

export const UserDataBox: FC<UserDataBoxProps> = ({ totalTrips, favoriteTrips, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.userDataContainer, pressed && styles.pressed]}
      onPress={totalTrips > 0 ? onPress : undefined}
    >
      {totalTrips > 0 && (
        <Fragment>
          <View style={styles.userDataItem}>
            <CustomText text="PROFILE.LABEL.TOTAL_TRIPS" style={styles.userDataLabel} />
            <View style={styles.userDataValueContainer}>
              <CustomText text={totalTrips?.toString() ?? '0'} style={styles.userDataValue} />
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.userDataItem}>
            <CustomText text="PROFILE.LABEL.FAVORITE_TRIPS" style={styles.userDataLabel} />
            <View style={styles.userDataValueContainer}>
              <CustomText text={favoriteTrips?.length?.toString() ?? '0'} style={styles.userDataValue} />
            </View>
          </View>
          <View style={styles.divider} />
        </Fragment>
      )}
      <View style={styles.userDataItem}>
        <CustomText text="PROFILE.LABEL.REMAINING_TOKENS" style={styles.userDataLabel} />
        <View style={[styles.userDataValueContainer, styles.capStatusContainer]}>
          <CustomText text={'5'} style={[styles.userDataValue, styles.capStatusText]} />
        </View>
      </View>
    </Pressable>
  );
};
