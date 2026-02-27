import { components } from '@/ui/style/dimensions/components';
import { BaseButton, type CustomButtonProps } from './BaseButton';

export function CustomButtonLarge(props: CustomButtonProps) {
  return <BaseButton {...props} size={components.buttonLargeHeight} />;
}
