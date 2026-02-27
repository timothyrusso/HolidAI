export default ({ config }) => {
  const {
    GOOGLE_PLACES_API_KEY,
    GOOGLE_MAPS_API_KEY_IOS,
    GOOGLE_MAPS_API_KEY_ANDROID,
    GOOGLE_SERVICES_PLIST,
    GOOGLE_SERVICES_PLIST_LOCAL_PATH,
    GOOGLE_SERVICES_JSON,
    GOOGLE_SERVICES_JSON_LOCAL_PATH,
    GOOGLE_GEMINI_API_KEY,
    RAPID_API_KEY,
    UNSPLASH_ACCESS_KEY,
    MMKV_ENCRYPTION_KEY,
    CLERK_PUBLISHABLE_KEY,
    CONVEX_URL,
  } = process.env;

  return {
    ...config,
    extra: {
      ...config.extra,
      googlePlacesApiKey: GOOGLE_PLACES_API_KEY,
      convexUrl: CONVEX_URL,
      googleGeminiApiKey: GOOGLE_GEMINI_API_KEY,
      rapidApiKey: RAPID_API_KEY,
      unsplashAccessKey: UNSPLASH_ACCESS_KEY,
      mmkvEncryptionKey: MMKV_ENCRYPTION_KEY,
      clerkPublishableKey: CLERK_PUBLISHABLE_KEY,
    },
    ios: {
      ...config.ios,
      googleServicesFile: GOOGLE_SERVICES_PLIST ?? GOOGLE_SERVICES_PLIST_LOCAL_PATH,
      googleMapsApiKey: GOOGLE_MAPS_API_KEY_IOS,
    },
    android: {
      ...config.android,
      adaptiveIcon: {
        backgroundColor: '#FFFFFF',
      },
      edgeToEdgeEnabled: true,
      config: {
        googleMaps: {
          apiKey: GOOGLE_MAPS_API_KEY_ANDROID,
        },
      },
      googleServicesFile: GOOGLE_SERVICES_JSON ?? GOOGLE_SERVICES_JSON_LOCAL_PATH,
    },
    plugins: ['expo-web-browser'],
  };
};
