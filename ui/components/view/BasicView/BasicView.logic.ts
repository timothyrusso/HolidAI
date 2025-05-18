import { Platform, StatusBar } from 'react-native';
import { match } from 'ts-pattern';

import { logger } from '@/di/resolve';
import { PlatformOS } from '@/ui/constants/PlatformOS';
import { spacing } from '@/ui/constants/style/dimensions/spacing';
import type { BasicViewProps } from './BasicView';
import { styles } from './BasicView.style';

export const useBasicViewLogic = ({
  nameView,
  isFullScreen = false,
  isMenuVisible = false,
  bottomButtonTitle,
  bottomButtonPress,
  hasHeader = true,
}: BasicViewProps) => {
  logger.debug('+++++++++++++++ Render view:', nameView, ' +++++++++++++++');

  const paddingTop = match({ isFullScreen, platform: Platform.OS })
    .with({ isFullScreen: false, platform: PlatformOS.android }, () => (hasHeader ? 0 : (StatusBar.currentHeight ?? 0)))
    .otherwise(() => 0);

  const paddingBottom = isMenuVisible && bottomButtonTitle && bottomButtonPress ? spacing.separator40 : 0;

  const componentStyle = styles(paddingTop, paddingBottom);

  return {
    componentStyle,
  };
};

export default useBasicViewLogic;
