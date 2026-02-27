import { components } from '@/ui/style/dimensions/components';
import { BaseButton, type CustomButtonProps } from './BaseButton';

export function CustomButtonMedium(props: CustomButtonProps) {
  return <BaseButton {...props} size={components.buttonMediumHeight} />;
}
