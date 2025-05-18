import { TYPES } from '@/di/types';
import Constants from 'expo-constants';
import { MMKV } from 'react-native-mmkv';
import { container } from 'tsyringe';

const mmkvInstance = new MMKV({
  id: 'travel-app.expo.storage',
  encryptionKey: Constants.expoConfig?.extra?.mmkvEncryptionKey,
});

container.registerInstance(TYPES.MMKV, mmkvInstance);
