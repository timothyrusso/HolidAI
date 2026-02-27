import { PlatformOS } from '@/ui/device/PlatformOS';
import { spacing } from '@/ui/style/dimensions/spacing';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { match } from 'ts-pattern';
import { style } from './CustomHeader.style';

/**
 * CustomHeaderContainer logic
 * Returns the style component which manages the safe area insets based on the platform and
 * according to react-navigation documentation for custom headers:
 * https://reactnavigation.org/docs/handling-safe-area/#hiddencustom-header-or-tab-bar
 */
export const useCustomHeaderLogic = () => {
  const { top } = useSafeAreaInsets();

  const headerPaddingTop = match(Platform.OS)
    .with(PlatformOS.android, () => top + spacing.SingleAndHalf)
    .otherwise(() => top);

  const styleComponent = style(headerPaddingTop);

  return {
    styleComponent,
  };
};
