import type { Decorator, Preview } from '@storybook/react-native-web-vite';
import { useFonts } from 'expo-font';
import { createInstance } from 'i18next';
import { type PropsWithChildren, useEffect } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/features/core/design-system/style/dimensions/spacing';
import { fontsConfig } from '@/features/core/design-system/style/fontFamily';
import translationEn from '@/features/core/translations/libraries/locales/en.json';
import translationIt from '@/features/core/translations/libraries/locales/it.json';

const LOCALES = ['en', 'it'] as const;

type Locale = (typeof LOCALES)[number];

const DEFAULT_LOCALE: Locale = 'en';

const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value);

/**
 * Storybook-local i18next instance. The app's `initI18n` is deliberately not reused: it resolves
 * through `@/features/core/storage`, which instantiates MMKV (a Nitro native module with no
 * react-native-web support) at import time and would crash this runtime on import. Storybook only
 * needs the locale bundles, so it gets its own isolated instance built from the same JSON files.
 */
const storybookI18n = createInstance();

void storybookI18n.use(initReactI18next).init({
  resources: {
    en: { translation: translationEn },
    it: { translation: translationIt },
  },
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: { escapeValue: false },
});

type StoryFrameProps = PropsWithChildren<{ locale: Locale }>;

function StoryFrame({ locale, children }: StoryFrameProps) {
  // Storybook bypasses `expo-router/entry`, so `app/_layout.tsx` — where the app calls
  // `useFonts(fontsConfig)` — never runs. Without this the design-system's `inter-*` families
  // are unknown to the renderer and every label silently falls back (a serif on web, the system
  // font on device), which makes the catalogue lie about typography.
  //
  // `Ionicons` is loaded here too, and only on web: on iOS/Android the
  // `@react-native-vector-icons/ionicons` config plugin links the font natively, but nothing
  // does that in a browser, so every `CustomIcon` renders as a blank/tofu glyph. The family name
  // must match the icon set's `postScriptName` ('Ionicons').
  const [fontsLoaded, fontsError] = useFonts({
    ...fontsConfig,
    Ionicons: require('@react-native-vector-icons/ionicons/fonts/Ionicons.ttf'),
  });

  useEffect(() => {
    void storybookI18n.changeLanguage(locale);
  }, [locale]);

  // Render nothing WHILE loading: a first paint in the fallback font would be a misleading
  // screenshot for any visual check. A load FAILURE is a different story — it never resolves, so
  // bailing out on it too would leave the catalogue blank forever with nothing to look at. Render
  // the story with degraded typography instead: a visibly wrong font is a readable symptom.
  if (!fontsLoaded && !fontsError) return null;

  return (
    <I18nextProvider i18n={storybookI18n}>
      <View style={styles.container}>{children}</View>
    </I18nextProvider>
  );
}

const withI18n: Decorator = (Story, context) => (
  <StoryFrame locale={isLocale(context.globals.locale) ? context.globals.locale : DEFAULT_LOCALE}>
    <Story />
  </StoryFrame>
);

/**
 * Not a design token: the app has no width breakpoint, and `Dimensions.get('window')` returns the
 * browser width on web. This only caps the canvas so a full-width button is framed like a phone
 * screen instead of stretching across a desktop viewport.
 */
const PHONE_VIEWPORT_WIDTH = 360;

const styles = StyleSheet.create({
  container: {
    maxWidth: PHONE_VIEWPORT_WIDTH,
    // `spacing.Fourfold` is the app's dominant screen padding, so a full-width button is inset here
    // exactly as it is on a real screen. Hardcoding a different value made the catalogue render
    // buttons at a width the app never produces.
    padding: spacing.Fourfold,
    width: '100%',
  },
});

const preview: Preview = {
  decorators: [withI18n],
  initialGlobals: { locale: DEFAULT_LOCALE },
  globalTypes: {
    locale: {
      description: 'Locale used by the Storybook-local i18next instance',
      toolbar: {
        icon: 'globe',
        items: LOCALES.map(locale => ({ value: locale, title: locale.toUpperCase() })),
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
