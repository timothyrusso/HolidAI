import { spacing } from '@/features/core/ui';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

export const formSheetOptions: NativeStackNavigationOptions = {
  presentation: 'formSheet',
  headerShown: false,
  sheetGrabberVisible: true,
  sheetAllowedDetents: Platform.select({ android: [0.5, 0.92], default: [0.5, 1.0] }),
  sheetInitialDetentIndex: 0,
  sheetCornerRadius: spacing.Fourfold,
} as const;
