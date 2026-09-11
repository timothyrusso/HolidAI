import type { Decorator, Preview } from '@storybook/react-native';
import { useFonts } from 'expo-font';
import { createInstance } from 'i18next';
import { type PropsWithChildren, useEffect } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useGlobals } from 'storybook/preview-api';

import { colors } from '@/features/core/design-system/style/colors';
import { fontSize } from '@/features/core/design-system/style/dimensions/fontSize';
import { spacing } from '@/features/core/design-system/style/dimensions/spacing';
import { fontFamily, fontsConfig } from '@/features/core/design-system/style/fontFamily';
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
 * react-native-web support) at import time. Storybook only needs the locale bundles, so it gets its
 * own isolated instance built from the same JSON files.
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

type StoryFrameProps = PropsWithChildren<{
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}>;

function StoryFrame({ locale, onLocaleChange, children }: StoryFrameProps) {
  // NOTE: Storybook bypasses `expo-router/entry`, so `app/_layout.tsx` — where the app calls
  // `useFonts(fontsConfig)` — never runs, and every label would silently fall back off the
  // design-system's `inter-*` families onto the system font.
  const [fontsLoaded, fontsError] = useFonts(fontsConfig);

  useEffect(() => {
    void storybookI18n.changeLanguage(locale);
  }, [locale]);

  // NOTE: render nothing WHILE loading, because a first paint in the fallback font is a misleading
  // screenshot. A load FAILURE never resolves, so bailing out on it too would leave the catalogue
  // blank forever: the story renders with degraded typography instead.
  if (!fontsLoaded && !fontsError) return null;

  return (
    <I18nextProvider i18n={storybookI18n}>
      <View style={styles.container}>
        <View style={styles.localeBar}>
          {LOCALES.map(item => (
            <Pressable
              key={item}
              accessibilityRole="button"
              onPress={() => onLocaleChange(item)}
              style={[styles.localeButton, item === locale && styles.localeButtonSelected]}
            >
              <Text style={[styles.localeLabel, item === locale && styles.localeLabelSelected]}>
                {item.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
        {children}
      </View>
    </I18nextProvider>
  );
}

const withI18n: Decorator = (Story, context) => {
  const [, updateGlobals] = useGlobals();
  const locale = isLocale(context.globals.locale) ? context.globals.locale : DEFAULT_LOCALE;

  return (
    <StoryFrame locale={locale} onLocaleChange={next => updateGlobals({ locale: next })}>
      <Story />
    </StoryFrame>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.Triple,
    padding: spacing.Fourfold,
  },
  localeBar: {
    flexDirection: 'row',
    gap: spacing.SingleAndHalf,
  },
  localeButton: {
    borderColor: colors.primaryGrey,
    borderRadius: spacing.Single,
    borderWidth: spacing.HalfMinimal,
    paddingHorizontal: spacing.Double,
    paddingVertical: spacing.Single,
  },
  localeButtonSelected: {
    backgroundColor: colors.primaryBlack,
    borderColor: colors.primaryBlack,
  },
  localeLabel: {
    color: colors.primaryBlack,
    fontFamily: fontFamily.interMedium,
    fontSize: fontSize.SM,
  },
  localeLabelSelected: {
    color: colors.primaryWhite,
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
