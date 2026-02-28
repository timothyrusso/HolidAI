import { PlatformOS } from '@/modules/shared/domain/PlatformOS';
import { colors } from '@/ui/style/colors';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

export const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: Platform.OS === PlatformOS.android ? 'none' : 'default',
  contentStyle: { backgroundColor: colors.primaryWhite },
};
