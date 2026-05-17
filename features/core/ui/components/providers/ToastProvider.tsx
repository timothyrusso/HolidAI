import { spacing } from '@/features/core/ui/style/dimensions/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export const ToastProvider = () => {
  const { top } = useSafeAreaInsets();
  return <Toast topOffset={top + spacing.SingleAndHalf} />;
};
