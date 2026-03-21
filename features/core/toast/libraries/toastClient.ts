import type { ToastType } from '@/features/core/toast/domain/entities/ToastType';
import Toast from 'react-native-toast-message';

export const toastClient = {
  show(params: { type: ToastType; text1: string; text2?: string }): void {
    Toast.show(params);
  },
};
