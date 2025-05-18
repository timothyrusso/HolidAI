export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY,
      firebaseConfig: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
      },
      googleGeminiApiKey: process.env.GOOGLE_GEMINI_API_KEY,
      rapidApiKey: process.env.RAPID_API_KEY,
      unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY,
      mmkvEncryptionKey: process.env.MMKV_ENCRYPTION_KEY,
    },
    ios: {
      ...config.ios,
      googleServicesFile: process.env.GOOGLE_SERVICES_PLIST ?? process.env.GOOGLE_SERVICES_PLIST_LOCAL_PATH,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS,
    },
    android: {
      ...config.android,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID,
        },
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? process.env.GOOGLE_SERVICES_JSON_LOCAL_PATH,
    },
  };
};
