import type { NativeStackNavigationOptions } from 'expo-router';
import { Platform } from 'react-native';
import { colors, PlatformOS } from '@/features/core/ui';

export const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: Platform.OS === PlatformOS.android ? 'none' : 'default',
  contentStyle: { backgroundColor: colors.primaryWhite },
} as const;
