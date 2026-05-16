import { RootAppCrashView } from '@/features/core/error/pages';
import { Stacks, screenOptions } from '@/features/core/navigation';
import { queryClient } from '@/features/core/query';
import { initSentry, registerNavigationContainer, wrap } from '@/features/core/sentry';
import { initI18n } from '@/features/core/translations';
import { ToastProvider, fontsConfig } from '@/features/core/ui';
import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { reloadAppAsync } from 'expo';
import { useAssets } from 'expo-asset';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { type ErrorBoundaryProps, SplashScreen, Stack, useNavigationContainerRef } from 'expo-router';
import { useEffect } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';

initSentry();
initI18n();

const InitialLayout = () => {
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name={Stacks.Main} />
    </Stack>
  );
};

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  return <RootAppCrashView error={error} retry={() => reloadAppAsync()} />;
}

export default wrap(function RootLayout() {
  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref) {
      registerNavigationContainer(ref);
    }
  }, [ref]);

  // biome-ignore lint/style/noNonNullAssertion: following the convex docs: https://docs.convex.dev/quickstart/react-native
  const convex = new ConvexReactClient(Constants.expoConfig?.extra?.convexUrl!, {
    unsavedChangesWarning: false,
  });

  SplashScreen.preventAutoHideAsync();

  const [fontsLoaded] = useFonts({
    ...fontsConfig,
  });

  const [welcomeAssets, welcomeAssetsError] = useAssets([
    require('@/features/core/ui/assets/images/welcome_1.jpg'),
    require('@/features/core/ui/assets/images/welcome_2.jpg'),
    require('@/features/core/ui/assets/images/welcome_3.jpg'),
    require('@/features/core/ui/assets/images/welcome_4.jpg'),
    require('@/features/core/ui/assets/images/welcome_5.jpg'),
    require('@/features/core/ui/assets/images/welcome_6.jpg'),
    require('@/features/core/ui/assets/images/logo_round.png'),
  ]);

  const appReady = fontsLoaded && (!!welcomeAssets || !!welcomeAssetsError);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <QueryClientProvider client={queryClient}>
            <KeyboardProvider>
              <InitialLayout />
              <ToastProvider />
            </KeyboardProvider>
          </QueryClientProvider>
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
});
