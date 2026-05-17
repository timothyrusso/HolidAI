import { Platform, StatusBar, type StyleProp, type ViewStyle } from 'react-native';
import { match } from 'ts-pattern';

import { logger } from '@/features/core/error';
import { PlatformOS } from '@/features/core/ui/PlatformOS';
import { styles } from '@/features/core/ui/components/view/BasicView/BasicView.style';
import { spacing } from '@/features/core/ui/style/dimensions/spacing';

export type BasicViewProps = {
  isFullScreen?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  viewStyle?: StyleProp<ViewStyle>;
  nameView: string;
  bottomButtonTitle?: string;
  bottomButtonPress?: () => void;
  bottomButtonDisabled?: boolean;
  bottomButtonLoading?: boolean;
  topGradientColor?: string;
  bottomGradientColor?: string;
  isMenuVisible?: boolean;
  statusBarStyle?: 'light' | 'dark';
  hasHeader?: boolean;
};

export const useBasicViewLogic = ({
  nameView,
  isFullScreen = false,
  isMenuVisible = false,
  bottomButtonTitle,
  bottomButtonPress,
  hasHeader,
}: BasicViewProps) => {
  // Accepted exception to the "log only in useCases/" rule: render tracing for
  // development only. SentryLogger.debug() is a no-op in production, so the DI
  // config already ensures this never reaches Sentry.
  logger.debug('+++++++++++++++ Render view:', nameView, ' +++++++++++++++');

  const paddingTop = match({ isFullScreen, platform: Platform.OS })
    .with({ isFullScreen: false, platform: PlatformOS.android }, () =>
      !hasHeader ? 0 : (StatusBar.currentHeight ?? 0),
    )
    .otherwise(() => 0);

  const paddingBottom = isMenuVisible && bottomButtonTitle && bottomButtonPress ? spacing.separator40 : 0;

  const componentStyle = styles(paddingTop, paddingBottom);

  return {
    componentStyle,
  };
};

export default useBasicViewLogic;
