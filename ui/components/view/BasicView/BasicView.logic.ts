import { Platform, StatusBar } from 'react-native';
import { match } from 'ts-pattern';

import { logger } from '@/features/core/error';
import { PlatformOS } from '@/ui/PlatformOS';
import type { BasicViewProps } from '@/ui/components/view/BasicView/BasicView';
import { styles } from '@/ui/components/view/BasicView/BasicView.style';
import { spacing } from '@/ui/style/dimensions/spacing';

export const useBasicViewLogic = ({
  nameView,
  isFullScreen = false,
  isMenuVisible = false,
  bottomButtonTitle,
  bottomButtonPress,
  hasHeader,
}: BasicViewProps) => {
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
