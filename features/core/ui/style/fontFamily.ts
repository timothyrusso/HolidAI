export const fontFamily = {
  interRegular: 'inter-regular',
  interMedium: 'inter-medium',
  interBold: 'inter-bold',
  interExtraBold: 'inter-extrabold',
  arimaRegular: 'arima-regular',
  arimaBold: 'arima-bold',
  arimaSemiBold: 'arima-semibold',
  arimaMedium: 'arima-medium',
} as const;

export const fontsConfig = {
  'inter-regular': require('@/features/core/ui/assets/fonts/Inter-Regular.ttf'),
  'inter-medium': require('@/features/core/ui/assets/fonts/Inter-Medium.ttf'),
  'inter-bold': require('@/features/core/ui/assets/fonts/Inter-Bold.ttf'),
  'inter-extrabold': require('@/features/core/ui/assets/fonts/Inter-ExtraBold.ttf'),
  'arima-regular': require('@/features/core/ui/assets/fonts/Arima-Regular.ttf'),
  'arima-bold': require('@/features/core/ui/assets/fonts/Arima-Bold.ttf'),
  'arima-semibold': require('@/features/core/ui/assets/fonts/Arima-SemiBold.ttf'),
  'arima-medium': require('@/features/core/ui/assets/fonts/Arima-Medium.ttf'),
} as const;
