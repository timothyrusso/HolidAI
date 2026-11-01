import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { QueryClientProvider } from '@tanstack/react-query';
import { EffectRuntimeProvider } from '@timothyrusso/effect-core/react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { reloadAppAsync } from 'expo';
import { useAssets } from 'expo-asset';
import { useFonts } from 'expo-font';
import { type ErrorBoundaryProps, SplashScreen, Stack, useNavigationContainerRef } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import type { AppConfigValues } from '@/features/core/config';
import { fontsConfig, ToastProvider } from '@/features/core/design-system';
import { RootAppCrashView } from '@/features/core/error/pages';
import { Stacks, screenOptions } from '@/features/core/navigation';
import { queryClient } from '@/features/core/query';
import { bootRuntime, runtime } from '@/features/core/runtime';
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

  const [config, setConfig] = useState<AppConfigValues | null>(null);
  const [bootError, setBootError] = useState<Error | null>(null);
  useEffect(() => {
    bootRuntime().then(setConfig, (error: unknown) => {
      reportBootFailure(error);
      setBootError(error instanceof Error ? error : new Error(String(error)));
    });
  }, []);

  const convex = useMemo(
    () => (config ? new ConvexReactClient(config.convexUrl, { unsavedChangesWarning: false }) : null),
    [config],
  );

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

  const launched = appReady && (convex !== null || bootError !== null);

  useEffect(() => {
    if (launched) {
      SplashScreen.hideAsync();
    }
  }, [launched]);

  if (bootError) {
    return <RootAppCrashView error={bootError} retry={() => reloadAppAsync()} />;
  }

  if (!(appReady && config && convex)) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <ClerkProvider publishableKey={config.clerkPublishableKey} tokenCache={tokenCache}>
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
