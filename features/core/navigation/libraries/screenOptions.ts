import { PlatformOS, colors } from '@/features/core/ui';
import type { NativeStackNavigationOptions } from 'expo-router';
import { Platform } from 'react-native';

export const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: Platform.OS === PlatformOS.android ? 'none' : 'default',
  contentStyle: { backgroundColor: colors.primaryWhite },
} as const;
