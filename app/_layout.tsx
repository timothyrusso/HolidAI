import { queryClient } from '@/di/resolve';
import { screenOptions } from '@/ui/constants/navigation/ScreenOptions';
import { Stacks } from '@/ui/constants/navigation/routes';
import { fontsConfig } from '@/ui/constants/style/fonts';
import i18n from '@/ui/translations/i18n';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';

const InitialLayout = () => {
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name={Stacks.Main} />
    </Stack>
  );
};

export default function RootLayout() {
  // Initialize localization
  i18n;

  // biome-ignore lint/style/noNonNullAssertion: <following the convex docs: https://docs.convex.dev/quickstart/react-native>
  const convex = new ConvexReactClient(Constants.expoConfig?.extra?.convexUrl!, {
    unsavedChangesWarning: false,
  });

  SplashScreen.preventAutoHideAsync();

  const [fontsLoaded] = useFonts({
    ...fontsConfig,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (
    <ClerkProvider publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ConvexProvider client={convex}>
          <QueryClientProvider client={queryClient}>
            <KeyboardProvider>
              <InitialLayout />
            </KeyboardProvider>
          </QueryClientProvider>
        </ConvexProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
