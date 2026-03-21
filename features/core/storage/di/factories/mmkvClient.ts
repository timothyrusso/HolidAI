import Constants from 'expo-constants';
import { MMKV } from 'react-native-mmkv';

export const mmkvClient = new MMKV({
  id: 'holidai.expo.storage',
  encryptionKey: Constants.expoConfig?.extra?.mmkvEncryptionKey,
});
