// @ts-ignore // Remove Firebase deprecation warning logs
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

import { queryClient } from '@/di/resolve';
import { screenOptions } from '@/ui/constants/navigation/ScreenOptions';
import { Stacks } from '@/ui/constants/navigation/routes';
import i18n from '@/ui/translations/i18n';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function RootLayout() {
  // Initialize localization
  i18n;

  useFonts({
    'inter-regular': require('../ui/assets/fonts/Inter-Regular.ttf'),
    'inter-medium': require('../ui/assets/fonts/Inter-Medium.ttf'),
    'inter-bold': require('../ui/assets/fonts/Inter-Bold.ttf'),
    'arima-regular': require('../ui/assets/fonts/Arima-Regular.ttf'),
    'arima-bold': require('../ui/assets/fonts/Arima-Bold.ttf'),
    'arima-semibold': require('../ui/assets/fonts/Arima-SemiBold.ttf'),
    'arima-medium': require('../ui/assets/fonts/Arima-Medium.ttf'),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        <Stack screenOptions={screenOptions}>
          <Stack.Screen name={Stacks.Main} />
        </Stack>
      </KeyboardProvider>
    </QueryClientProvider>
  );
}
