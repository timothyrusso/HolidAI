import AsyncStorage from '@react-native-async-storage/async-storage';

// Relative by necessity: Metro generates `storybook.requires.ts` next to this file.
import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

export default StorybookUIRoot;
