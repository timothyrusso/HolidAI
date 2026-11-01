import { MMKV } from 'react-native-mmkv';

/** The app's one encrypted MMKV instance. */
export const createMmkvClient = (encryptionKey: string) => new MMKV({ id: 'holidai.expo.storage', encryptionKey });
