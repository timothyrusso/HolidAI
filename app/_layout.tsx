// Polyfill for window.addEventListener untile official Convex fix is released
// Reference: https://github.com/get-convex/convex-backend/issues/304
if (typeof window !== 'undefined' && !window.addEventListener) {
  window.addEventListener = () => {};
  window.removeEventListener = () => {};
}

import { queryClient } from '@/di/resolve';
import { screenOptions } from '@/modules/navigation/domain/entities/ScreenOptions';
import { Stacks } from '@/modules/navigation/domain/entities/routes';
import i18n from '@/modules/translations/i18n';
import { fontsConfig } from '@/ui/style/fonts';
import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import * as Sentry from '@sentry/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { isRunningInExpoGo } from 'expo';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useNavigationContainerRef } from 'expo-router';
import { useEffect } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
  routeChangeTimeoutMs: 1000,
  ignoreEmptyBackNavigationTransactions: true,
});

Sentry.init({
  dsn: Constants.expoConfig?.extra?.sentryDsn,

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,
  enableLogs: true,
  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
});

const InitialLayout = () => {
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name={Stacks.Main} />
    </Stack>
  );
};

export default Sentry.wrap(function RootLayout() {
  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <QueryClientProvider client={queryClient}>
            <KeyboardProvider>
              <InitialLayout />
            </KeyboardProvider>
          </QueryClientProvider>
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
});
