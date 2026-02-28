import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

export enum ToastType {
  ERROR = 'error',
  SUCCESS = 'success',
  INFO = 'info',
}

export const useToast = () => {
  const { t } = useTranslation();

  const showToast = (text: string, type: ToastType = ToastType.ERROR, description?: string) => {
    Toast.show({
      type: type,
      text1: t(text),
      ...(description && { text2: t(description) }),
    });
  };

  return {
    showToast,
  };
};
