import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { QueryClientProvider } from '@tanstack/react-query';
import { EffectRuntimeProvider } from '@timothyrusso/effect-core/react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { reloadAppAsync } from 'expo';
import { useAssets } from 'expo-asset';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { type ErrorBoundaryProps, SplashScreen, Stack, useNavigationContainerRef } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { fontsConfig, ToastProvider } from '@/features/core/design-system';
import { RootAppCrashView } from '@/features/core/error/pages';
import { Stacks, screenOptions } from '@/features/core/navigation';
import { queryClient } from '@/features/core/query';
import { runtime } from '@/features/core/runtime';
import { initSentry, registerNavigationContainer, reportBootFailure, wrap } from '@/features/core/sentry';
import { initI18n } from '@/features/core/translations';

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

  const [bootError, setBootError] = useState<Error | null>(null);
  useEffect(() => {
    runtime.boot().catch((error: unknown) => {
      reportBootFailure(error);
      setBootError(error instanceof Error ? error : new Error(String(error)));
    });
  }, []);

  // biome-ignore lint/style/noNonNullAssertion: following the convex docs: https://docs.convex.dev/quickstart/react-native
  // biome-ignore lint/suspicious/noNonNullAssertedOptionalChain: following the convex docs: https://docs.convex.dev/quickstart/react-native
  const convex = new ConvexReactClient(Constants.expoConfig?.extra?.convexUrl!, {
    unsavedChangesWarning: false,
  });

  SplashScreen.preventAutoHideAsync();

  const [fontsLoaded] = useFonts({
    ...fontsConfig,
  });

  const [welcomeAssets, welcomeAssetsError] = useAssets([
    require('@/features/core/design-system/assets/images/welcome_1.jpg'),
    require('@/features/core/design-system/assets/images/welcome_2.jpg'),
    require('@/features/core/design-system/assets/images/welcome_3.jpg'),
    require('@/features/core/design-system/assets/images/welcome_4.jpg'),
    require('@/features/core/design-system/assets/images/welcome_5.jpg'),
    require('@/features/core/design-system/assets/images/welcome_6.jpg'),
    require('@/features/core/design-system/assets/images/logo_round.png'),
  ]);

  const appReady = fontsLoaded && (!!welcomeAssets || !!welcomeAssetsError);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (bootError) {
    return <RootAppCrashView error={bootError} retry={() => reloadAppAsync()} />;
  }

  if (!appReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <ClerkProvider publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey} tokenCache={tokenCache}>
        <ClerkLoaded>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <QueryClientProvider client={queryClient}>
              <EffectRuntimeProvider runtime={runtime}>
                <KeyboardProvider>
                  <InitialLayout />
                  <ToastProvider />
                </KeyboardProvider>
              </EffectRuntimeProvider>
            </QueryClientProvider>
          </ConvexProviderWithClerk>
        </ClerkLoaded>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
