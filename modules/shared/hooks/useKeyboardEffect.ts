import { PlatformOS } from '@/modules/shared/domain/PlatformOS';
import { components } from '@/ui/style/dimensions/components';
import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import { match } from 'ts-pattern';

/**
 * Custom hook that detects the visibility of the keyboard and provides the padding height for adjusting the UI.
 * It takes an optional parameter to ignore the bottom tab bar menu when calculating the padding height (useful for instance
 * with fullscreen modals).
 *
 * @returns {Object} An object containing the following properties:
 *   - isKeyboardVisible {boolean}: Indicates whether the keyboard is currently visible.
 *   - paddingHeight {number}: The height of the padding required to adjust the UI when the keyboard is visible.
 *   - keyboardHeight {number}: The height of the keyboard.
 */
const useKeyboardEffect = (ignoreBottomMenu = false) => {
  const [paddingHeight, setPaddingHeight] = useState(0);
  const [keyboard, setKeyboard] = useState({ height: 0, visible: false });

  const listenerType = match(Platform.OS)
    .with(PlatformOS.android, () => 'Did' as const)
    .otherwise(() => 'Will' as const);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(`keyboard${listenerType}Show`, e => {
      const endHeight = e.endCoordinates.height;

      const bottomMenuOnIos = { os: PlatformOS.ios, ignoreBottomMenu: false };
      const noBottomMenuOnIos = {
        ...bottomMenuOnIos,
        ignoreBottomMenu: true,
      };

      const height = match({ os: Platform.OS, ignoreBottomMenu })
        .with(bottomMenuOnIos, () => endHeight - components.bottomMenuHeight)
        .with(noBottomMenuOnIos, () => endHeight)
        .otherwise(() => 0);

      setKeyboard({ height: endHeight, visible: true });
      setPaddingHeight(height);
    });

    const keyboardHideListener = Keyboard.addListener(`keyboard${listenerType}Hide`, () => {
      setKeyboard({ height: 0, visible: false });
      setPaddingHeight(0);
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  return {
    isKeyboardVisible: keyboard.visible,
    keyboardHeight: keyboard.height,
    paddingHeight,
  };
};
export default useKeyboardEffect;
