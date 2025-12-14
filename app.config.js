export default ({ config }) => {
  const {
    GOOGLE_PLACES_API_KEY,
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID,
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
  } = process.env;

  return {
    ...config,
    extra: {
      ...config.extra,
      googlePlacesApiKey: GOOGLE_PLACES_API_KEY,
      firebaseConfig: {
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        projectId: FIREBASE_PROJECT_ID,
        storageBucket: FIREBASE_STORAGE_BUCKET,
        messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
        appId: FIREBASE_APP_ID,
      },
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
